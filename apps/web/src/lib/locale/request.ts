import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { loadLocaleMessages } from "./load-locale-message";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("locale")?.value || "en";
  const messages = await loadLocaleMessages(locale);

  return {
    locale,
    messages,
    defaultLocale: "en",
  };
});
