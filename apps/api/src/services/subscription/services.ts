import {
  companyQueries,
  db,
  membershipQueries,
  planQueries,
  subscriptionQueries,
  userQueries,
} from "@mep/db";
import { CompanyStatus, Role, type SubscriptionStatus } from "@mep/types";
import { StripeSubscriptionService } from "../stripe-subscriptions/service";
import { AuthService } from "../auth/service";
import type { SubscriptionActivateSchema, SubscriptionSchema } from "./schema";
import { logger } from "@/utils/logger";
import { TRPCError } from "@trpc/server";

export class SubscriptionService {
  static async createSubscription(input: SubscriptionSchema) {
    const supabaseUserId = await AuthService.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const result = await db.transaction(async (tx) => {
      const user = await userQueries.create(
        {
          supabaseId: supabaseUserId,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: "",
        },
        tx,
      );
      const company = await companyQueries.create(
        {
          name: input.companyName,
          stripeCustomerId: null,
          companyRegistrationNumber: input.companyRegistrationNumber,
          status: CompanyStatus.PENDING,
        },
        tx,
      );
      const membership = await membershipQueries.create(
        { userId: user.id, companyId: company.id, role: Role.OWNER },
        tx,
      );
      const subscriptionInfo =
        await StripeSubscriptionService.createStripeSubscription({
          email: input.email,
          companyName: input.companyName,
          companyRegistrationNumber: input.companyRegistrationNumber,
          companyId: company.id,
          membershipId: membership.id,
          userId: user.id,
        });

      // TODO: Sync plan with stripe
      const planId = process.env.PLAN_ID;
      if (!planId) throw new Error("PLAN_ID is missing in env");

      const subscription = await subscriptionQueries.create(
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

      return { user, company, membership, subscription };
    });

    return result;
  }

  static async activateSubscriptionFromStripe({
    userId,
    companyId,
    membershipId,
  }: SubscriptionActivateSchema) {
    const supabaseId = await userQueries.getSupabaseIdByUserId(userId, db);
    if (!supabaseId) throw new Error("Supabase ID not found");

    await db.transaction(async (tx) => {
      await userQueries.activate(userId, tx);
      await companyQueries.activate(companyId, tx);
      await membershipQueries.activate(membershipId, tx);
    });

    const magicLinkData =
      await AuthService.sendMagicLinkOnPaymentSuccess(supabaseId);
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
}
