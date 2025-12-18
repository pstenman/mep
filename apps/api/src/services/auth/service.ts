import { companyQueries, db, membershipQueries, userQueries, type DBTransaction } from "@mep/db";
import { getSupabase } from "@/utils/supabase";
import type { AuthActivateSchema, CreateAuthUserOwnerSchema } from "./schema";
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

  static async activateFromStripe({
  userId,
  companyId,
  membershipId,
  supabaseId
}: AuthActivateSchema) {
  logger.info({ userId, companyId, membershipId, supabaseId }, "Starting Stripe activation");

  await db.transaction(async (tx) => {
    logger.info({ userId }, "Activating user in DB");
    await userQueries.activate(userId, tx);

    logger.info({ companyId }, "Activating company in DB");
    await companyQueries.activate(companyId, tx);

    logger.info({ membershipId }, "Activating membership in DB");
    await membershipQueries.activate(membershipId, tx);
  });
  logger.info({ userId }, "Database activation completed");

  const supabase = getSupabase();

  logger.info({ userId }, "Fetching user from Supabase admin");
  const { data, error: fetchError } = await supabase.auth.admin.getUserById(userId);
  
  if (fetchError || !data?.user) {
    logger.error({ fetchError, userId }, "Failed to fetch user email for Magic Link");
    throw fetchError || new Error("User not found");
  }

  const email = data.user.email;
  if (!email) {
    logger.error({ userId }, "User email is missing in Supabase");
    throw new Error("User email is missing");
  }

  logger.info({ email, userId }, "Generating Magic Link");
  const { data: magicLinkData, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: process.env.SUPABASE_MAGIGLINK_REDIRECT || "http://localhost:3000",
    },
  });

  if (error) {
    logger.error({ error, userId }, "Failed to send Magic Link after Stripe activation");
    throw error;
  }

  logger.info({ userId }, "Magic Link sent successfully after Stripe activation");
  return magicLinkData;
}
}