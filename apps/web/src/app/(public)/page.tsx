import type { Metadata } from "next";
import { PublicView } from "@/components/public/view";

export const metadata: Metadata = {
  title: {
    default: "MeP",
    template: "%s - MeP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function PublicPage() {
  return <PublicView />;
}
