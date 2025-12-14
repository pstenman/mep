import { SubscribeView } from "@/components/stripe/view";
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
  return <SubscribeView />;
}
