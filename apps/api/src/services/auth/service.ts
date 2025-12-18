import { companyQueries, db, membershipQueries, userQueries, type DBTransaction } from "@mep/db";
import { getSupabase } from "@/utils/supabase";
import type { CreateAuthUserOwnerSchema } from "./schema";

export class AuthService {
  static async createUserOwner({
    firstName,
    lastName,
    email,
    companyName,
  }: CreateAuthUserOwnerSchema) {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (error && !error.message.includes("already exists")) {
      throw error;
    }

    if (!data.user) {
      throw new Error("No user found")
    }

    const supabaseUserId = data?.user.id;

    if (!supabaseUserId) {
      throw new Error("Supabase user id missing");
    }

    const result = await db.transaction(async (tx) => {
      const user = await userQueries.create({
        supabaseId: supabaseUserId,
        email,
        firstName,
        lastName,
        phoneNumber: "",
      }, 
      tx
    );

      const company = await companyQueries.create({
        name: companyName,
        stripeCustomerId: null,
      }, 
      tx
    );

      const membership = await membershipQueries.create({
        userId: user.id,
        companyId: company.id,
        role: "OWNER",
      }, 
      tx
    );

      return { user, company, membership };
    });

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (otpError) throw otpError;

    return result;
  }
}