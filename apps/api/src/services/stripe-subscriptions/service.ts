import type { StripeCustomerSchema } from "../stripe/schema";
import { StripeService } from "../stripe/services";
import Stripe from "stripe";
import { logger } from "@/utils/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export class StripeSubscriptionService {
  static async createStripeSubscription(input: StripeCustomerSchema) {
    const customer = await StripeService.createCustomer({
      email: input.email,
      companyName: input.companyName,
      companyRegistrationNumber: input.companyRegistrationNumber,
      metadata: {
        userId: input.userId.toString(),
        companyId: input.companyId.toString(),
        membershipId: input.membershipId,
      },
    });

    const subscription = await StripeService.createSubscription({
      customerId: customer.id,
      priceId: process.env.STRIPE_BASIC_PRICE_ID!,
      metadata: {
        userId: input.userId.toString(),
        companyId: input.companyId.toString(),
        membershipId: input.membershipId,
      },
    });

    const planInfo = await StripeService.getPlanInfo(
      process.env.STRIPE_BASIC_PRICE_ID!,
      process.env.STRIPE_BASIC_PRODUCT_ID!,
    );

    const latestInvoice = subscription.latest_invoice as
      | Stripe.Invoice
      | string
      | null;

    if (!latestInvoice) {
      throw new Error("Latest invoice not found in subscription");
    }

    const invoiceObj = await stripe.invoices.retrieve(
      typeof latestInvoice === "string" ? latestInvoice : latestInvoice.id,
      { expand: ["confirmation_secret"] },
    );

    const confirmationSecret = (invoiceObj as any).confirmation_secret as
      | { client_secret: string }
      | null
      | undefined;

    if (!confirmationSecret?.client_secret) {
      logger.error(
        {
          subscriptionId: subscription.id,
          invoiceId: invoiceObj.id,
        },
        "confirmation_secret not found - this should not happen",
      );
      throw new Error("Payment confirmation secret not available");
    }

    logger.info(
      {
        subscriptionId: subscription.id,
        invoiceId: invoiceObj.id,
      },
      "Using confirmation_secret for embedded subscription payment",
    );

    return {
      companyName: input.companyName,
      plan: planInfo.plan,
      amount: planInfo.amount,
      clientSecret: confirmationSecret.client_secret,
      customerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      paymentIntentStatus: "ready" as const,
    };
  }
}
