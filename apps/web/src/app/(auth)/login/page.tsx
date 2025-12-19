import { LoginView } from "@/components/login/view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Log in",
    template: "%s - MeP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function LoginPage() {
  return <LoginView />;
}
