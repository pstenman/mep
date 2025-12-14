import { corsLoggingMiddleware } from "@/middleware/corsMiddleware";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { logger } from "@/utils/logger";
import { appRouter } from "@/trpc/router";
import { createTRPCContext } from "@/trpc/context";
import { trpcServer } from "@hono/trpc-server"

const app = new Hono();

app.use(secureHeaders());
app.use("*", corsLoggingMiddleware);

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return null;
      const allowed = process.env.ALLOWED_API_ORIGINS?.split(",").map(s => s.trim()) ?? [];
      return allowed.includes(origin) ? origin : null;
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-request-id"],  
  })
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: ({ req }) => createTRPCContext({req, resheader: req.headers})
  })
)

const port = 3001;

const server = {
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
)

export default server;
