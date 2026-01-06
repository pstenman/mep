import {
  companyQueries,
  db,
  membershipQueries,
  planQueries,
  subscriptionQueries,
  userQueries,
  subscriptions,
  memberships,
  companies,
  users,
} from "@mep/db";
import { CompanyStatus, Role, type SubscriptionStatus } from "@mep/types";
import { StripeSubscriptionService } from "../stripe-subscriptions/service";
import { AuthService } from "../auth/service";
import type { SubscriptionActivateSchema, SubscriptionSchema } from "./schema";
import { logger } from "@/utils/logger";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getSupabase } from "@/lib/supabase";

export class SubscriptionService {
  static async createSubscription(input: SubscriptionSchema) {
    const supabaseUserId = await AuthService.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const { user, company, membership } = await db.transaction(async (tx) => {
      const createdUser = await userQueries.create(
        {
          supabaseId: supabaseUserId,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: "",
        },
        tx,
      );
      const createdCompany = await companyQueries.create(
        {
          name: input.companyName,
          stripeCustomerId: null,
          companyRegistrationNumber: input.companyRegistrationNumber,
          status: CompanyStatus.PENDING,
        },
        tx,
      );
      const createdMembership = await membershipQueries.create(
        {
          userId: createdUser.id,
          companyId: createdCompany.id,
          role: Role.OWNER,
        },
        tx,
      );
      return {
        user: createdUser,
        company: createdCompany,
        membership: createdMembership,
      };
    });

    let subscriptionInfo: Awaited<
      ReturnType<typeof StripeSubscriptionService.createStripeSubscription>
    >;
    try {
      subscriptionInfo =
        await StripeSubscriptionService.createStripeSubscription({
          email: input.email,
          companyName: input.companyName,
          companyRegistrationNumber: input.companyRegistrationNumber,
          companyId: company.id,
          membershipId: membership.id,
          userId: user.id,
        });
    } catch (error) {
      await SubscriptionService.cleanupFailedSubscription({
        userId: user.id,
        companyId: company.id,
        membershipId: membership.id,
      });
      throw error;
    }

    const subscription = await db.transaction(async (tx) => {
      const defaultPlan = await planQueries.getDefault();
      if (!defaultPlan) {
        throw new Error("No plan found in database. Please seed plans first.");
      }
      const planId = defaultPlan.id;

      return await subscriptionQueries.create(
        {
          companyId: company.id,
          stripeSubscriptionId: subscriptionInfo.subscriptionId,
          stripeCustomerId: subscriptionInfo.customerId,
          planId,
          status: subscriptionInfo.subscriptionStatus as SubscriptionStatus,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(),
          cancelAtPeriodEnd: false,
          canceledAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        tx,
      );
    });

    return { user, company, membership, subscription };
  }

  static async activateSubscriptionFromStripe({
    userId,
    companyId,
    membershipId,
  }: SubscriptionActivateSchema) {
    const supabaseId = await userQueries.getSupabaseIdByUserId(userId, db);
    if (!supabaseId) throw new Error("Supabase ID not found");

    const user = await userQueries.getById(userId);
    if (!user) throw new Error("User not found");
    if (!user.email) throw new Error("User email not found");

    await db.transaction(async (tx) => {
      await userQueries.activate(userId, tx);
      await companyQueries.activate(companyId, tx);
      await membershipQueries.activate(membershipId, tx);
    });

    const magicLinkData = await AuthService.sendMagicLinkOnPaymentSuccess(
      user.email,
    );
    logger.info(
      { userId, companyId, membershipId, magicLink: magicLinkData },
      "Subscription activated and magic link sent",
    );

    return magicLinkData;
  }

  static async getSubscription({
    companyId,
    userId,
  }: {
    companyId: string;
    userId: string;
  }) {
    const membership = await membershipQueries.findByUserAndCompany(
      userId,
      companyId,
      db,
    );

    // TODO: make role helper function
    if (
      !membership ||
      membership.role.toUpperCase() !== Role.OWNER.toUpperCase()
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to view subscription",
      });
    }

    const subscription = await subscriptionQueries.findByCompanyId(
      companyId,
      db,
    );

    if (!subscription) {
      return { hasSubscription: false };
    }

    const plan = await planQueries.getById(subscription.planId);

    return {
      hasSubscription: true,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCustomerId: subscription.stripeCustomerId,
      plan,
    };
  }

  static async cleanupFailedSubscription({
    userId,
    companyId,
    membershipId,
  }: {
    userId: string;
    companyId: string;
    membershipId: string;
  }) {
    const user = await userQueries.getById(userId);
    if (!user) {
      logger.warn({ userId }, "User not found for cleanup");
      return;
    }

    await db.transaction(async (tx) => {
      const subscription = await subscriptionQueries.findByCompanyId(
        companyId,
        tx,
      );
      if (subscription) {
        await tx
          .delete(subscriptions)
          .where(eq(subscriptions.id, subscription.id));
      }

      await tx.delete(memberships).where(eq(memberships.id, membershipId));

      await tx.delete(companies).where(eq(companies.id, companyId));

      await tx.delete(users).where(eq(users.id, userId));
    });

    try {
      const supabase = getSupabase();
      if (user.supabaseId) {
        await supabase.auth.admin.deleteUser(user.supabaseId);
      }
    } catch (error) {
      logger.error(
        { error, userId },
        "Failed to delete Supabase user during cleanup",
      );
    }

    logger.info(
      { userId, companyId, membershipId },
      "Cleaned up failed subscription",
    );
  }
}
