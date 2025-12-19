import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MeP",
    template: "%s - MeP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Testing Layout</h2>
    </div>
  );
}
