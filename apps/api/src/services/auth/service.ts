import { getSupabase } from "@/utils/supabase";

export class AuthService {
  static async createUserWithMagicLink({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    const supabase = getSupabase();
    const { data: _user, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (createError && !createError.message.includes("already exists")) {
      throw createError;
    }
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (otpError) throw otpError;

    return { email };
  }

}