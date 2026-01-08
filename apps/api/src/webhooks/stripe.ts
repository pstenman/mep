import { SubscriptionService } from "@/services/subscription/services";
import { subscriptionQueries, userQueries, db } from "@mep/db";
import { Hono } from "hono";
import Stripe from "stripe";
import type { SubscriptionStatus } from "@mep/types";
import { CompanyStatus } from "@mep/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const stripeWebhookRoute = new Hono();

stripeWebhookRoute.post("/", async (c) => {
  const sig = c.req.header("stripe-signature");
  if (!sig) return c.text("Missing stripe-signature", 400);

  const rawBody = await c.req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      bodyBuffer,
      sig,
      process.env.STRIPE_SECRET_WEBHOOK!,
    );
  } catch (error: any) {
    return c.text(`Webhook Error: ${error.message}`, 400);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as any).subscription as string | null;

    if (!subscriptionId || typeof subscriptionId !== "string") {
      return c.text("Missing subscription ID", 200);
    }

    const stripeSubscription =
      await stripe.subscriptions.retrieve(subscriptionId);
    const metadata = stripeSubscription.metadata ?? {};
    const { userId, companyId, membershipId } = metadata;

    if (
      stripeSubscription.status === "active" &&
      userId &&
      companyId &&
      membershipId
    ) {
      try {
        const user = await userQueries.getById(userId, true);
        const company = await db.query.companies.findFirst({
          where: (companies, { eq }) => eq(companies.id, companyId),
        });
        const existingSubscription = await subscriptionQueries.findByCompanyId(
          companyId,
          db,
        );

        if (
          user?.isActive &&
          company?.status === CompanyStatus.ACTIVE &&
          existingSubscription?.status === "active"
        ) {
          return c.text("Already activated", 200);
        }

        await SubscriptionService.activateSubscriptionFromStripe({
          userId,
          companyId,
          membershipId,
          stripeSubscriptionId: subscriptionId,
        });
        return c.text("Activation completed", 200);
      } catch (error: any) {
        const errorDetails: Record<string, unknown> = {
          message: error?.message || String(error) || "Unknown error",
        };
        return c.text(`Activation failed: ${errorDetails.message}`, 500);
      }
    }

    return c.text("Webhook processed", 200);
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const metadata = subscription.metadata ?? {};
    const { userId, companyId, membershipId } = metadata;

    if (
      subscription.status === "active" &&
      userId &&
      companyId &&
      membershipId
    ) {
      try {
        const user = await userQueries.getById(userId, true);
        const company = await db.query.companies.findFirst({
          where: (companies, { eq }) => eq(companies.id, companyId),
        });
        const existingSubscription = await subscriptionQueries.findByCompanyId(
          companyId,
          db,
        );

        if (
          user?.isActive &&
          company?.status === CompanyStatus.ACTIVE &&
          existingSubscription?.status === "active"
        ) {
          return c.text("Already activated", 200);
        }

        if (subscription.cancel_at_period_end !== undefined) {
          if (existingSubscription) {
            await subscriptionQueries.update(
              existingSubscription.stripeSubscriptionId,
              {
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                canceledAt: subscription.canceled_at
                  ? new Date(subscription.canceled_at * 1000)
                  : null,
                status: subscription.status as SubscriptionStatus,
              },
              db,
            );
          }
        }

        await SubscriptionService.activateSubscriptionFromStripe({
          userId,
          companyId,
          membershipId,
          stripeSubscriptionId: subscription.id,
        });
        return c.text("Activation completed", 200);
      } catch (error: any) {
        const errorDetails: Record<string, unknown> = {
          message: error?.message || String(error) || "Unknown error",
        };
        return c.text(`Activation failed: ${errorDetails.message}`, 500);
      }
    }

    return c.text("Webhook processed", 200);
  }

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const metadata = subscription.metadata ?? {};
    const { userId, companyId, membershipId } = metadata;

    if (
      subscription.status === "active" &&
      userId &&
      companyId &&
      membershipId
    ) {
      try {
        await SubscriptionService.activateSubscriptionFromStripe({
          userId,
          companyId,
          membershipId,
          stripeSubscriptionId: subscription.id,
        });
        return c.text("Activation completed", 200);
      } catch (error: any) {
        const errorDetails: Record<string, unknown> = {
          message: error?.message || String(error) || "Unknown error",
        };
        return c.text(`Activation failed: ${errorDetails.message}`, 500);
      }
    }
    return c.text("Webhook processed", 200);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as any).subscription as string | null;

    if (!subscriptionId || typeof subscriptionId !== "string") {
      return c.text("Missing subscription ID", 200);
    }

    const stripeSubscription =
      await stripe.subscriptions.retrieve(subscriptionId);
    const metadata = stripeSubscription.metadata ?? {};

    const { userId, companyId, membershipId } = metadata;

    if (userId && companyId && membershipId) {
      await SubscriptionService.cleanupFailedSubscription({
        userId,
        companyId,
        membershipId,
      });
    }
    return c.text("Cleanup completed", 200);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const metadata = subscription.metadata ?? {};

    const { userId, companyId, membershipId } = metadata;

    if (
      userId &&
      companyId &&
      membershipId &&
      subscription.status === "incomplete"
    ) {
      await SubscriptionService.cleanupFailedSubscription({
        userId,
        companyId,
        membershipId,
      });
    }
    return c.text("Webhook processed", 200);
  }

  return c.text("Webhook processed", 200);
});
