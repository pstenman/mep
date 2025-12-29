import { getSupabase } from "@/lib/supabase";

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
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo:
          process.env.SUPABASE_MAGICLINK_REDIRECT ||
          "http://localhost:3000/auth/callback",
      },
    });
    if (error) throw error;
    return data;
  }

  static async sendMagicLinkOnPaymentSuccess(email: string) {
    return AuthService.sendMagicLink(email);
  }
}
