import { logger } from "@/utils/logger";
import { db } from "@mep/db";
import type { Role } from "@mep/types/src";
import type { HonoRequest } from "hono";

export const createTRPCContext = async (opts: {
  req: HonoRequest;
  resheader: Headers;
  auth: { userId: string | null; companyId: string | null; role: Role | null };
}) => {
  const { auth, req } = opts;

  // Log auth info for debugging
  logger.debug({
    userId: auth.userId,
    companyId: auth.companyId,
    role: auth.role,
    path: req.path,
    method: req.method,
  }, "🛠 TRPC context auth debug");
  return {
  db,
  auth: opts.auth,
  getHeader: (name: string) => opts.req.header(name),
}};

type BaseContext = Awaited<ReturnType<typeof createTRPCContext>>;

export type ProtectedContext = BaseContext & {
  userId: string;
  companyId: string;
  role: Role;
};

export type Context = BaseContext | ProtectedContext;

