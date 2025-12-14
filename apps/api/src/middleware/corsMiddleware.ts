import type { MiddlewareHandler } from "hono";
import { logger } from "../utils/logger";

export const corsLoggingMiddleware: MiddlewareHandler = async (c, next) => {
  const origin = c.req.header("origin") ?? "";
  const ua = c.req.header("user-agent") ?? "";
  const allowedOrigins = (process.env.ALLOWED_API_ORIGINS || "").split(",");
  const isAllowed = allowedOrigins.includes(origin);

  logger.info({
    origin,
    userAgent: ua,
    path: c.req.path,
    method: c.req.method,
    isAllowed,
    allowedOrigins,
  }, "🌐 CORS check");

  return next();
};