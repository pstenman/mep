import { getSupabase } from "@/lib/supabase";
import { AUTH_SYMBOL, type AuthUser } from "@/types/auth";
import { logger } from "@/utils/logger";
import { db } from "@mep/db";
import { eq } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("authorization") ?? "";
  const reqAny = c.req as any;
  reqAny[AUTH_SYMBOL] = null;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const supabaseUrl = process.env.SUPABASE_URL!;
  const isLocal =
    supabaseUrl.includes("127.0.0.1") || supabaseUrl.includes("localhost");

  let payload: any;

  try {
    if (isLocal) {
      payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );
    } else {
      const supabase = getSupabase();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error(error?.message || "Token verification failed");
      }

      payload = { sub: user.id };
      logger.debug(
        { userId: user.id, email: user.email },
        "📝 Verified user via Supabase API",
      );
    }

    const supabaseId = payload.sub;
    if (!supabaseId) return next();

    const user = await db.query.users.findFirst({
      where: (u) => eq(u.supabaseId, supabaseId),
    });
    if (!user) return next();

    const membership = await db.query.memberships.findFirst({
      where: (m) => eq(m.userId, user.id),
    });

    reqAny[AUTH_SYMBOL] = {
      userId: user.id,
      supabaseId,
      companyId: membership?.companyId ?? null,
      role: membership?.role ?? null,
      email: user.email,
    } satisfies AuthUser;

    logger.debug(
      { authContext: reqAny[AUTH_SYMBOL] },
      "✅ Auth context populated",
    );
  } catch (err) {
    logger.error(
      { error: err instanceof Error ? err.message : String(err) },
      "❌ Token verification/decoding failed",
    );
    reqAny[AUTH_SYMBOL] = null;
  }

  return next();
};
