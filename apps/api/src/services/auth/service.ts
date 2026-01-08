import { getSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/utils/logger";

export class AuthService {
  static async createUser({
    email,
    firstName,
    lastName,
  }: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<string> {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (error) throw error;
    if (!data.user?.id) {
      throw new Error("Supabase user id missing");
    }

    return data.user.id;
  }

  static async sendMagicLink(email: string) {
    const redirectUrl = process.env.SUPABASE_MAGICLINK_REDIRECT;
    if (!redirectUrl) {
      throw new Error(
        "SUPABASE_MAGICLINK_REDIRECT environment variable is not set",
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || "";
    const isDev =
      process.env.NODE_ENV === "development" ||
      process.env.LOG_MAGIC_LINKS === "true" ||
      !process.env.NODE_ENV ||
      supabaseUrl.includes("127.0.0.1") ||
      supabaseUrl.includes("localhost");

    if (isDev) {
      const supabase = getSupabase();

      const { data: linkData, error: linkError } =
        await supabase.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: {
            redirectTo: redirectUrl,
          },
        });

      if (linkError) {
        logger.error(
          { error: linkError, email, redirectUrl },
          "Failed to generate magic link",
        );
        throw linkError;
      }

      const magicLink = linkData.properties?.action_link;

      if (!magicLink) {
        logger.error(
          { email, redirectUrl, linkData },
          "Magic link generated but action_link is missing",
        );
        throw new Error("Magic link action_link is missing");
      }

      logger.info(
        {
          email,
          magicLink,
          redirectUrl,
        },
        "🔗 Magic link generated (DEV MODE - not sent via email)",
      );

      console.log("\n" + "=".repeat(80));
      console.log("🔗 MAGIC LINK (DEV MODE):");
      console.log(magicLink);
      console.log("=".repeat(80) + "\n");

      return linkData;
    }

    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseAnonKey) {
      throw new Error("SUPABASE_ANON_KEY environment variable is not set");
    }

    logger.info(
      {
        redirectUrl,
        email,
      },
      "🔗 Sending magic link via signInWithOtp",
    );

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) throw error;

    logger.info(
      {
        email,
      },
      "🔗 Magic link sent via SMTP (Resend)",
    );

    return data;
  }

  static async sendMagicLinkOnPaymentSuccess(email: string) {
    return AuthService.sendMagicLink(email);
  }
}
