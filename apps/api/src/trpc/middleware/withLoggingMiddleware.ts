import { logger } from "@/utils/logger";
import { t } from "../server";

export const withLoggingMiddleware = t.middleware(
  async ({ path, input, next }) => {
    const requestId = crypto.randomUUID();
    const start = Date.now();

    logger.info({ requestId, path, input }, "⚡ tRPC procedure start");

    try {
      const result = await next();
      const duration = Date.now() - start;
      logger.info(
        { requestId, path, duration, output: result },
        "✅ tRPC procedure end",
      );
      return result;
    } catch (err) {
      const duration = Date.now() - start;
      logger.error(
        { requestId, path, duration, err },
        "❌ tRPC procedure error",
      );
      throw err;
    }
  },
);
