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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "SUPABASE_URL or SUPABASE_ANON_KEY environment variables are not set",
      );
    }

    logger.info(
      {
        redirectUrl,
        email,
      },
      "🔗 Sending magic link via signInWithOtp",
    );

    // Create a regular Supabase client (not admin) to use signInWithOtp
    // This will automatically send the email via configured SMTP (Resend)
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
