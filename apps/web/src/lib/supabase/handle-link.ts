import { getSupabaseBrowser } from "./supabase-browser";

export const handleMagicLinkCallback = async (router: ReturnType<any>) => {
  const supabase = getSupabaseBrowser();

  const hash = window.location.hash.replace("#", "?");
  const params = new URLSearchParams(hash);

  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (!access_token || !refresh_token) {
    console.error("Magic link callback: tokens missing");
    router.replace("/login");
    return;
  }

  try {
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error("Failed to set session:", error);
      router.replace("/login");
      return;
    }

    router.replace("/dashboard");
  } catch (err) {
    console.error("Error handling magic link:", err);
    router.replace("/login");
  }
};
