import { getSupabase } from "@/lib/supabase";

export class AuthService {
  static async createUser({
    email,
    firstName,
    lastName,
    password = "Test123",
  }: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
  }): Promise<string> {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password,
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (error && !error.message.includes("already exists")) throw error;
    if (!data.user?.id) throw new Error("Supabase user id missing");

    return data.user.id;
  }

    static async sendMagicLink(email: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: process.env.SUPABASE_MAGICLINK_REDIRECT || "http://localhost:3000/auth/callback" },
    });
    if (error) throw error;
    return data;
  }

  static async ensureUserExists(supabaseId: string) {
    const supabase = getSupabase();
    let supabaseUser: any = null;

    for (let i = 0; i < 5; i++) {
      const { data } = await supabase.auth.admin.getUserById(supabaseId);
      if (data?.user) {
        supabaseUser = data.user;
        break;
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!supabaseUser) {
      const { data } = await supabase.auth.admin.createUser({
        id: supabaseId,
        email: "",
        password: "Temp123!",
        email_confirm: true,
      });
      supabaseUser = data.user;
    }

    if (!supabaseUser.email) throw new Error("Supabase user missing email");
    return supabaseUser.email;
  }

  static async sendMagicLinkOnPaymentSuccess(supabaseId: string) {
    const email = await this.ensureUserExists(supabaseId);
    return await this.sendMagicLink(email);
  }
}
