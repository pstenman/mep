import { SubscriptionService } from "@/services/subscription/services";
import { subscriptionQueries, db } from "@mep/db";
import { logger } from "@/utils/logger";
import { Hono } from "hono";
import Stripe from "stripe";

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
    logger.error({ error }, "Webhook signature verification failed");
    return c.text(`Webhook Error: ${error.message}`, 400);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as any).subscription as string | null;

    if (!subscriptionId || typeof subscriptionId !== "string") {
      logger.warn(
        { invoiceId: invoice.id },
        "Missing subscription ID in invoice.payment_succeeded",
      );
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
        const existingSubscription = await subscriptionQueries.findByCompanyId(
          companyId,
          db,
        );

        if (existingSubscription?.status === "active") {
          return c.text("Already activated", 200);
        }

        await SubscriptionService.activateSubscriptionFromStripe({
          userId,
          companyId,
          membershipId,
          stripeSubscriptionId: subscriptionId,
        });
        logger.info(
          { userId, companyId, subscriptionId },
          "Subscription activated via invoice.payment_succeeded",
        );
        return c.text("Activation completed", 200);
      } catch (error: any) {
        const errorDetails: Record<string, unknown> = {
          message: error?.message || String(error) || "Unknown error",
          name: error?.name,
          stack: error?.stack,
        };
        logger.error(
          {
            error: errorDetails,
            userId,
            companyId,
            membershipId,
            subscriptionId,
            invoiceId: invoice.id,
          },
          "Failed to activate subscription from invoice.payment_succeeded",
        );
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
        const existingSubscription = await subscriptionQueries.findByCompanyId(
          companyId,
          db,
        );

        if (existingSubscription?.status === "active") {
          return c.text("Already activated", 200);
        }

        await SubscriptionService.activateSubscriptionFromStripe({
          userId,
          companyId,
          membershipId,
          stripeSubscriptionId: subscription.id,
        });
        logger.info(
          { userId, companyId, subscriptionId: subscription.id },
          "Subscription activated via customer.subscription.updated",
        );
        return c.text("Activation completed", 200);
      } catch (error: any) {
        const errorDetails: Record<string, unknown> = {
          message: error?.message || String(error) || "Unknown error",
          name: error?.name,
          stack: error?.stack,
        };
        logger.error(
          {
            error: errorDetails,
            userId,
            companyId,
            membershipId,
            subscriptionId: subscription.id,
          },
          "Failed to activate subscription from webhook",
        );
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
        logger.info(
          { userId, companyId, subscriptionId: subscription.id },
          "Subscription activated via customer.subscription.created",
        );
        return c.text("Activation completed", 200);
      } catch (error: any) {
        const errorDetails: Record<string, unknown> = {
          message: error?.message || String(error) || "Unknown error",
          name: error?.name,
          stack: error?.stack,
        };
        logger.error(
          {
            error: errorDetails,
            userId,
            companyId,
            membershipId,
            subscriptionId: subscription.id,
          },
          "Failed to activate subscription from webhook",
        );
        return c.text(`Activation failed: ${errorDetails.message}`, 500);
      }
    }
    return c.text("Webhook processed", 200);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as any).subscription as string | null;

    if (!subscriptionId || typeof subscriptionId !== "string") {
      logger.warn(
        { invoiceId: invoice.id },
        "Missing subscription ID in invoice",
      );
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
