import { createRemoteJWKSet } from "jose";

export const supabaseJWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/vi/jwks`),
);
