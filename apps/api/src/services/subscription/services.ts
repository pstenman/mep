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
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getSupabase } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

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

    let stripeSubscription: Stripe.Subscription;
    try {
      stripeSubscription = await stripe.subscriptions.retrieve(
        subscriptionInfo.subscriptionId,
      );
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve subscription from Stripe: ${error?.message || "Unknown error"}`,
      );
    }

    const subscription = await db.transaction(async (tx) => {
      const defaultPlan = await planQueries.getDefault();
      if (!defaultPlan) {
        throw new Error("No plan found in database. Please seed plans first.");
      }
      const planId = defaultPlan.id;

      const subscriptionData = stripeSubscription as any;

      const currentPeriodStart =
        subscriptionData.current_period_start &&
        subscriptionData.current_period_start > 0
          ? new Date(subscriptionData.current_period_start * 1000)
          : new Date();

      const currentPeriodEnd =
        subscriptionData.current_period_end &&
        subscriptionData.current_period_end > 0 &&
        subscriptionData.current_period_end >
          subscriptionData.current_period_start
          ? new Date(subscriptionData.current_period_end * 1000)
          : new Date(currentPeriodStart.getTime() + 90 * 24 * 60 * 60 * 1000);

      return await subscriptionQueries.create(
        {
          companyId: company.id,
          stripeSubscriptionId: subscriptionInfo.subscriptionId,
          stripeCustomerId: subscriptionInfo.customerId,
          planId,
          status: subscriptionInfo.subscriptionStatus as SubscriptionStatus,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: subscriptionData.cancel_at_period_end ?? false,
          canceledAt: subscriptionData.canceled_at
            ? new Date(subscriptionData.canceled_at * 1000)
            : null,
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
    stripeSubscriptionId,
  }: SubscriptionActivateSchema & { stripeSubscriptionId?: string }) {
    const user = await userQueries.getById(userId, true);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    if (!user.supabaseId) {
      throw new Error(`Supabase ID not found for user: ${userId}`);
    }

    if (!user.email) {
      throw new Error(`User email not found for user: ${userId}`);
    }

    const subscription = await subscriptionQueries.findByCompanyId(
      companyId,
      db,
    );

    if (!subscription) {
      throw new Error(`Subscription not found for company: ${companyId}`);
    }

    const subscriptionIdToUse =
      stripeSubscriptionId || subscription.stripeSubscriptionId;

    let stripeSubscription: Stripe.Subscription;
    try {
      stripeSubscription =
        await stripe.subscriptions.retrieve(subscriptionIdToUse);
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve subscription from Stripe: ${error?.message || "Unknown error"}`,
      );
    }

    if (
      stripeSubscriptionId &&
      stripeSubscriptionId !== subscription.stripeSubscriptionId
    ) {
      await subscriptionQueries.update(
        subscription.stripeSubscriptionId,
        {
          stripeSubscriptionId: stripeSubscriptionId,
        },
        db,
      );
      subscription.stripeSubscriptionId = stripeSubscriptionId;
    }

    try {
      await db.transaction(async (tx) => {
        await userQueries.activate(userId, tx);
        await companyQueries.activate(companyId, tx);
        await membershipQueries.activate(membershipId, tx);

        const subscriptionData = stripeSubscription as any;
        const currentPeriodStart = subscriptionData.current_period_start;
        const currentPeriodEnd = subscriptionData.current_period_end;

        await subscriptionQueries.update(
          subscription.stripeSubscriptionId,
          {
            status: stripeSubscription.status as SubscriptionStatus,
            currentPeriodStart: currentPeriodStart
              ? new Date(currentPeriodStart * 1000)
              : subscription.currentPeriodStart,
            currentPeriodEnd: currentPeriodEnd
              ? new Date(currentPeriodEnd * 1000)
              : subscription.currentPeriodEnd,
            cancelAtPeriodEnd:
              subscriptionData.cancel_at_period_end ??
              subscription.cancelAtPeriodEnd,
            canceledAt: subscriptionData.canceled_at
              ? new Date(subscriptionData.canceled_at * 1000)
              : subscription.canceledAt,
          },
          tx,
        );
      });
    } catch (error: any) {
      throw new Error(
        `Failed to activate subscription: ${error?.message || "Unknown error"}`,
      );
    }

    let magicLinkData: Awaited<
      ReturnType<typeof AuthService.sendMagicLinkOnPaymentSuccess>
    >;
    try {
      magicLinkData = await AuthService.sendMagicLinkOnPaymentSuccess(
        user.email,
      );

      const magicLink = (magicLinkData as any).properties?.action_link;

      if (magicLink) {
        console.log("\n" + "=".repeat(80));
        console.log("🔗 MAGIC LINK (DEV MODE):");
        console.log(magicLink);
        console.log("=".repeat(80) + "\n");
      } else {
        console.log("\n" + "=".repeat(80));
        console.log("⚠️ MAGIC LINK DATA (action_link missing):");
        console.log(JSON.stringify(magicLinkData, null, 2));
        console.log("=".repeat(80) + "\n");
      }
    } catch (error: any) {
      throw new Error(
        `Subscription activated but failed to send magic link: ${error?.message || "Unknown error"}`,
      );
    }

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
    } catch {
      // Silent fail during cleanup
    }
  }
}
