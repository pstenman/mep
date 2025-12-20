import { requireAuth, requireCompany } from "./middleware/withAuthMiddleware";
import { t } from "./server";

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(requireAuth);
export const companyProcedure = protectedProcedure.use(requireCompany);
