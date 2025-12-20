import { companyQueries, db, membershipQueries, userQueries, type DBTransaction } from "@mep/db";
import { getSupabase } from "@/lib/supabase";
import { authActivateSchema, type AuthActivateSchema, type CreateAuthUserOwnerSchema, type SendMagicLinkOnPaymentSuccessSchema } from "./schema";
import { logger } from "@/utils/logger";

export class AuthService {
  static async createUserOwner({
    firstName,
    lastName,
    email,
    companyName,
    companyRegistrationNumber
  }: CreateAuthUserOwnerSchema) {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password: "Test123",
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
    }, tx);

    const company = await companyQueries.create({
      name: companyName,
      stripeCustomerId: null,
      companyRegistrationNumber: companyRegistrationNumber,
      status: "PENDING",
    }, tx);

    const membership = await membershipQueries.create({
      userId: user.id,
      companyId: company.id,
      role: "OWNER",
    }, tx);

    return { user, company, membership };
  });

  logger.info({ result }, "Transaction result");
  return result;
  }

  static async sendMagicLinkOnPaymentSuccess({
    supabaseId,
  }: SendMagicLinkOnPaymentSuccessSchema) {
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

    const { data: magicLinkData, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: supabaseUser.email,
      options: { redirectTo: process.env.SUPABASE_MAGIGLINK_REDIRECT || "http://localhost:3000/auth/callback" },
    });
    if (error) throw error;
    logger.info({ supabaseId, magicLink: magicLinkData }, "Magic link generated successfully");

    return magicLinkData;
  }

  static async authActivateFromStripe({
    userId,
    companyId,
    membershipId,
  }: AuthActivateSchema) {
    const supabaseId = await userQueries.getSupabaseIdByUserId(userId, db);
    logger.info({ userId, supabaseId }, "Supabase ID fetched from DB");

    if (!supabaseId) throw new Error("Supabase ID not found");

    await db.transaction(async (tx) => {
      await userQueries.activate(userId, tx);
      await companyQueries.activate(companyId, tx);
      await membershipQueries.activate(membershipId, tx);
    });
    logger.info({ userId, companyId, membershipId }, "DB transaction completed");

    return await this.sendMagicLinkOnPaymentSuccess({supabaseId });
  }
}
