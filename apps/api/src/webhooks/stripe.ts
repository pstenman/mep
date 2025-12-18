import { AuthService } from "@/services/auth/service";
import { logger } from "@/utils/logger";
import { db, userQueries } from "@mep/db";
import { Hono } from "hono";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
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

  if (
    ["customer.subscription.created", "invoice.payment_succeeded"].includes(
      event.type,
    )
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const { userId, companyId, membershipId } = subscription.metadata;

    if (userId && companyId && membershipId) {
      try {
        const supabaseId = await userQueries.getSupabaseIdByUserId(userId, db);

        if (!supabaseId) {
          logger.warn({ userId }, "No Supabase user linked to this app user");
          return c.text("No Supabase user found", 404);
        }

        await AuthService.activateFromStripe({
          userId,
          companyId,
          membershipId,
          supabaseId,
        });
        logger.info(
          { userId, supabaseId },
          "User activated via Stripe webhook",
        );
      } catch (err) {
        logger.error(
          { err, subscription },
          "Error activating user from Stripe webhook",
        );
        return c.text("Error activating user", 500);
      }
    } else {
      logger.warn(
        { subscription },
        "Missing metadata, cannot activate or send Magic Link",
      );
    }
  }

  return c.text("ok");
});
