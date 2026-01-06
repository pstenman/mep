import { corsLoggingMiddleware } from "@/middleware/corsMiddleware";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { logger } from "@/utils/logger";
import { appRouter } from "@/trpc/router";
import { createTRPCContext } from "@/trpc/context";
import { trpcServer } from "@hono/trpc-server";
import { stripeWebhookRoute } from "@/webhooks/stripe";
import { authMiddleware } from "@/middleware/authMiddleware";
import { AUTH_SYMBOL } from "@/types/auth";

const app = new Hono();

app.route("/webhook/stripe", stripeWebhookRoute);

app.use("*", secureHeaders());
app.use("/trpc/*", authMiddleware);
app.use("*", corsLoggingMiddleware);

app.use("*", (c, next) => {
  if (c.req.path.startsWith("/webhook/")) {
    return next();
  }

  return cors({
    origin: (origin) => {
      if (!origin) return null;
      const allowed =
        process.env.ALLOWED_API_ORIGINS?.split(",").map((s) => s.trim()) ?? [];
      return allowed.includes(origin) ? origin : null;
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-request-id"],
  })(c, next);
});

app.get("/", (c) => {
  return c.json({ status: "ok" });
});

app.all("/trpc/*", async (c, next) => {
  const reqAny = c.req as any;

  const ctx = await createTRPCContext({
    req: c.req,
    resheader: c.res.headers,
    auth: reqAny[AUTH_SYMBOL] ?? {
      userId: null,
      companyId: null,
      role: null,
    },
  });

  return trpcServer({
    router: appRouter,
    createContext: () => ctx,
  })(c, next);
});

const port = Number(process.env.PORT) || 3001;

export const server = {
  port,
  fetch: app.fetch,
  host: "::",
};

logger.info(
  {
    port,
    host: "::",
    environment: process.env.NODE_ENV || "developer",
    logLevel: process.env.NODE_ENV || "info",
  },
  "🚀API server starting",
);

if (import.meta.main) {
  Bun.serve(server);
}
