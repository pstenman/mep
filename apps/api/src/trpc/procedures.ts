import { Role } from "@mep/types";
import {
  requireAuth,
  requireCompany,
  requireRole,
  requireUserId,
} from "./middleware/withAuthMiddleware";
import { t } from "./server";
import { withLoggingMiddleware } from "./middleware/withLoggingMiddleware";

export const publicProcedure = t.procedure.use(withLoggingMiddleware);
export const protectedProcedure = t.procedure.use(requireUserId);
export const companyProcedure = t.procedure
  .use(requireAuth)
  .use(requireCompany);
export const ownerProcedure = companyProcedure.use(
  requireRole([Role.OWNER, Role.ADMIN]),
);
