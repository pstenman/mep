import {
  companyQueries,
  db,
  membershipQueries,
  subscriptionQueries,
  userQueries,
} from "@mep/db";
import type { SubscriptionStatus } from "@mep/types";
import { StripeSubscriptionService } from "../stripe-subscriptions/service";
import { AuthService } from "../auth/service";
import type { SubscriptionActivateSchema, SubscriptionSchema } from "./schema";
import { logger } from "@/utils/logger";

export class SubscriptionService {
  static async createSubscription(input: SubscriptionSchema) {
    const supabaseUserId = await AuthService.createUserOwner({
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
          status: "PENDING",
        },
        tx,
      );
      const membership = await membershipQueries.create(
        { userId: user.id, companyId: company.id, role: "OWNER" },
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
}
