import { useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js"
import type { StripePaymentElementOptions } from "@stripe/stripe-js";

export const useStripeConfirm = (clientSecret: string | null, opts: StripePaymentElementOptions) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmSetup({ elements, confirmParams: { return_url: window.location.href }, ...opts });

    if (stripeError) setError(stripeError.message ?? "Something went wrong");
    setLoading(false);
  };
  return { confirm, loading, error }
}