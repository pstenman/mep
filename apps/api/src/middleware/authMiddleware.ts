import { supabaseJWKS } from "@/auth/supabase-jwks";
import { AUTH_SYMBOL, type AuthUser } from "@/types/auth";
import { db } from "@mep/db";
import { eq } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";
import { jwtVerify } from "jose";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("authorization");
  const reqAny = c.req as any;
  reqAny[AUTH_SYMBOL] = null;

  if (!authHeader?.startsWith("Bearer ")) return next();

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const { payload } = await jwtVerify(token, supabaseJWKS, {
      audience: "authenticated",
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
    });

    const supabaseId = payload.sub as string;
    if (!supabaseId) return next();

    const users = await db.query.users.findFirst({
      where: (user) => eq(user.supabaseId, supabaseId),
    });

    if (!users) return next();

    const memberships = await db.query.memberships.findFirst({
      where: (membership) => eq(membership.userId, users.id),
    });

    reqAny[AUTH_SYMBOL] = {
      userId: users.id,
      supabaseId: users.supabaseId,
      companyId: memberships?.companyId ?? null,
      role: memberships?.role ?? null,
      email: users.email,
    } satisfies AuthUser;
  } catch {
    reqAny[AUTH_SYMBOL] = null;
  }

  return next();
};
