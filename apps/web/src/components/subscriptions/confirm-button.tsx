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

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Payment failed");
        onError?.(error.message ?? "Stripe error");
        return;
      }

      if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          toast.success("Payment confirmed! Processing subscription...");
          onSuccess?.();
        } else if (paymentIntent.status === "processing") {
          toast.info("Payment is being processed...");
          onSuccess?.();
        } else if (paymentIntent.status === "requires_action") {
          toast.info("Please complete authentication");
        } else {
          console.log("PaymentIntent status:", paymentIntent.status);
          toast.info("Payment confirmation in progress...");
          onSuccess?.();
        }
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Payment failed");
      onError?.(err?.message ?? "Stripe error");
    } finally {
      setConfirming(false);
    }
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
