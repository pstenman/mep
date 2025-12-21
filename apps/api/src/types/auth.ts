import type { Database } from "@mep/db";
import type { Role } from "@mep/types";

export type AuthUser = {
  userId: string;
  supabaseId: string;
  companyId: string | null;
  role: Role | null;
  email: string;
};

export const AUTH_SYMBOL = Symbol("auth");

export type BaseContext = {
  db: Database;
  auth: AuthUser | null;
  headers: Headers;
};

export type CompanyContext = BaseContext & {
  userId: string;
  companyId: string;
  role: Role;
};
