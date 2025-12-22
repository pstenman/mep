import { Role } from "@mep/types";
import { requireAuth, requireCompany, requireRole } from "./middleware/withAuthMiddleware";
import { t } from "./server";

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(requireAuth);
export const companyProcedure = protectedProcedure.use(requireCompany);
export const ownerProcedure = companyProcedure.use(requireRole([Role.OWNER, Role.ADMIN]));
