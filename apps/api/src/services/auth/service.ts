import { getSupabase } from "@/lib/supabase";
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
    const supabase = getSupabase();

    const redirectUrl = process.env.SUPABASE_MAGICLINK_REDIRECT;
    if (!redirectUrl) {
      throw new Error(
        "SUPABASE_MAGICLINK_REDIRECT environment variable is not set",
      );
    }

    logger.info(
      {
        redirectUrl,
        envVar: process.env.SUPABASE_MAGICLINK_REDIRECT,
        hasEnvVar: !!process.env.SUPABASE_MAGICLINK_REDIRECT,
        envVarLength: process.env.SUPABASE_MAGICLINK_REDIRECT?.length,
      },
      "🔗 Magic link redirect URL configuration",
    );

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) throw error;
    return data;
  }

  static async sendMagicLinkOnPaymentSuccess(email: string) {
    return AuthService.sendMagicLink(email);
  }
}
