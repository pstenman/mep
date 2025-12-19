import { AUTH_SYMBOL, type AuthUser } from "@/types/auth";
import { db } from "@mep/db";

export const createTRPCContext = async (opts: {
  req: Request;
  resheader: Headers;
}) => {
  const reqAny = opts.req as any;
  const auth = (reqAny[AUTH_SYMBOL] ?? null) as AuthUser | null;
  return {
    db,
    auth,
    headers: opts.req.headers,
  };
};

type BaseContext = Awaited<ReturnType<typeof createTRPCContext>>;

export type Context = BaseContext;
