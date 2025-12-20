import { SettingsView } from "@/components/settings/view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Settings",
    template: "%s - MeP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function SettingsPage() {
  return <SettingsView />;
}
