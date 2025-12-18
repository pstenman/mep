import { logger } from "@/utils/logger";
import Stripe from "stripe";
import type { StripeCustomerSchema } from "./schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export class StripeService {
  static async createCompanySubscription({
    email,
    companyName,
    companyRegistrationNumber,
    companyId,
    membershipId,
    userId
  }: StripeCustomerSchema) {
    logger.debug({ email, companyName, companyRegistrationNumber }, "Creating Stripe customer for company");

    const customer = await stripe.customers.create({
      name: companyName,
      email,
      metadata: {
        membershipId,
        userId,
        companyId,
        companyName,
        companyRegistrationNumber,
      },
    });
    logger.debug({ customerId: customer.id }, "Customer created");

    const priceId = process.env.STRIPE_BASIC_PRICE_ID!;
    const productId = process.env.STRIPE_BASIC_PRODUCT_ID!;
    if (!priceId) throw new Error("Missing STRIPE_BASIC_PRICE_ID");
    if (!productId) throw new Error("Missing STRIPE_BASIC_PRODUCT_ID");

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      metadata: {
        userId: userId.toString(),
        companyId: companyId.toString(),
        membershipId: membershipId,
        email
      },
      expand: ["latest_invoice.confirmation_secret"],
    });
    logger.debug({ subscriptionId: subscription.id }, "Subscription created");

    const invoice = subscription.latest_invoice as any;
    if (!invoice) throw new Error("Subscription has no latest_invoice");

    const confirmationSecret = invoice.confirmation_secret?.client_secret;
    if (!confirmationSecret)
      throw new Error("Invoice confirmation_secret.client_secret missing");

    const product = await stripe.products.retrieve(productId);
    const plan = product.name || "Basic";

    const priceObj = await stripe.prices.retrieve(priceId);
    const amount = priceObj.unit_amount
      ? `${(priceObj.unit_amount / 100).toFixed(2)} ${priceObj.currency.toUpperCase()}`
      : "$0";

    logger.debug(
      { clientSecret: confirmationSecret, plan, amount },
      "Returning client secret and plan info"
    );

    return {
      companyName,
      plan,
      amount,
      clientSecret: confirmationSecret,
      customerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    };
  }
}