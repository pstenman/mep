import { createRemoteJWKSet } from "jose";

const supabaseUrl = process.env.SUPABASE_URL!;
const isLocal =
  supabaseUrl.includes("127.0.0.1") ||
  supabaseUrl.includes("localhost");

export const supabaseJWKS = !isLocal
  ? createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/keys`))
  : null;
