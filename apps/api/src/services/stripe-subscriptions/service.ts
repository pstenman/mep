import type { StripeCustomerSchema } from "../stripe/schema";
import { StripeService } from "../stripe/services";

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

    const invoice = subscription.latest_invoice as any;
    const clientSecret = invoice?.confirmation_secret?.client_secret;

    if (!clientSecret) {
      throw new Error("Invoice confirmation_secret.client_secret missing");
    }

    return {
      companyName: input.companyName,
      plan: planInfo.plan,
      amount: planInfo.amount,
      clientSecret,
      customerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    };
  }
}
