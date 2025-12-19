import type { Role } from "@mep/types";

export type AuthUser = {
  userId: string;
  supabaseId: string;
  companyId: string | null;
  role: Role | null;
  email: string;
};

export const AUTH_SYMBOL = Symbol("auth");
