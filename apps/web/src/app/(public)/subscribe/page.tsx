import { SubscribeView } from "@/components/stripe/view";
import { StripeProvider } from "@/providers/stripe-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Subscribe",
    template: "%s - MeP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function SubscribePage() {
  return (
    <StripeProvider>
      <SubscribeView />
    </StripeProvider>
  );
}
