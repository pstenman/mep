import { SubscriptionService } from "@/services/subscription/services";
import { logger } from "@/utils/logger";
import { Hono } from "hono";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const stripeWebhookRoute = new Hono();

stripeWebhookRoute.post("/", async (c) => {
  logger.info("Stripe webhook hit");

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

    const line = invoice.lines.data[0];
    const metadata = line?.metadata ?? {};

    const { userId, companyId, membershipId } = metadata;

    if (!userId || !companyId || !membershipId) {
      logger.warn({ invoiceId: invoice.id }, "Missing metadata");
      return c.text("Missing metadata", 200);
    }

    if (invoice.amount_paid <= 0) {
      logger.info({ invoiceId: invoice.id }, "Zero-amount invoice, skipping");
      return c.text("Zero invoice", 200);
    }

    await SubscriptionService.activateSubscriptionFromStripe({
      userId,
      companyId,
      membershipId,
    });
  }
  return c.text("Activation completed", 200);
});
