import { useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@mep/ui";
import { toast } from "sonner";

export function StripeConfirmButton({
  paymentReady,
  loading,
  onError,
  onSuccess,
}: {
  paymentReady: boolean;
  loading: boolean;
  onError?: (msg: string) => void;
  onSuccess?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [confirming, setConfirming] = useState(false);

  const confirm = async () => {
    if (!stripe || !elements) return;

    const paymentElement = elements.getElement("payment");
    if (!paymentElement) {
      toast.error("Payment form is not ready");
      onError?.("Payment element not mounted");
      return;
    }

    setConfirming(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: undefined },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message ?? "Payment failed");
      onError?.(error.message ?? "Stripe error");
    } else if (setupIntent?.status === "succeeded") {
      toast.success("Payment method saved successfully");
      onSuccess?.();
    }

    setConfirming(false);
  };

  return (
    <Button
      onClick={confirm}
      disabled={loading || confirming || !paymentReady}
      className="w-full"
    >
      {confirming ? "Confirming…" : "Confirm payment"}
    </Button>
  );
}
