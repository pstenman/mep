"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { FC, ReactNode } from "react";

const stripekey = process.env.NEXT_PUBLIC_STRIPE_KEY;

if (!stripekey) {
  throw new Error("❌ NEXT_PUBLIC_STRIPE_KEY is undefined!");
}

export const stripePromise = loadStripe(stripekey, {
  developerTools: { assistant: { enabled: false } },
});

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: FC<StripeProviderProps> = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
