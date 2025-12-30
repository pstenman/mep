import type { Appearance, StripeElementLocale } from "@stripe/stripe-js";

export type Theme = "light" | "dark" | "system";

export const mapTheme = (theme: Theme): Appearance => {
  if (theme === "dark") return { theme: "night" };
  return { theme: "stripe" };
};

export const mapLocale = (locale: string): StripeElementLocale => {
  switch (locale) {
    case "sv":
      return "sv";
    case "en":
      return "en";
    default:
      return "auto";
  }
};
