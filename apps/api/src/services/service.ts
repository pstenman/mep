import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover"
}) 

export class StripeService {
  static async createCustomerAndSetupIntent({
    firstName,
    lastName,
    email,
    companyName,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
  }) {
    const customer = await stripe.customers.create({
      name: `${firstName} ${lastName}`,
      email,
      metadata: { companyName },
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    return { 
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    };
  }
}