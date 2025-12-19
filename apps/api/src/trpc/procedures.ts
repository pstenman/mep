import { withAuthMiddleware } from "./middleware/withAuthMiddleware";
import { t } from "./server";

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(withAuthMiddleware);
