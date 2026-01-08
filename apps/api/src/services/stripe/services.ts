import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export class StripeService {
  static async createCustomer({
    email,
    companyName,
    companyRegistrationNumber,
    metadata,
  }: {
    email: string;
    companyName: string;
    companyRegistrationNumber: string;
    metadata: Record<string, string>;
  }) {
    const stripeCustomer = await stripe.customers.create({
      name: companyName,
      email,
      metadata: {
        ...metadata,
        companyRegistrationNumber,
      },
    });
    return stripeCustomer;
  }

  static async createSubscription({
    customerId,
    priceId,
    metadata,
  }: {
    customerId: string;
    priceId: string;
    metadata: Record<string, string>;
  }) {
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      metadata,
      expand: ["latest_invoice"],
    });
    return stripeSubscription;
  }

  static async getPlanInfo(priceId: string, productId: string) {
    const product = await stripe.products.retrieve(productId);
    const price = await stripe.prices.retrieve(priceId);

    return {
      plan: product.name || "Basic",
      amount: price.unit_amount
        ? `${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()}`
        : "$0",
    };
  }

  static async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ) {
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }
}
