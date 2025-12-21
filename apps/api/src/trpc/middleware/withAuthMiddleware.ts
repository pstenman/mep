import { TRPCError } from "@trpc/server";
import { t } from "../server";
import type { Role } from "@mep/types/src";
import type { BaseContext } from "@/types/auth";

export type CompanyContext = BaseContext & {
  userId: string;
  companyId: string;
  role: Role;
};
export const requireAuth = t.middleware<{
  ctx: BaseContext;
}>(({ ctx, next }) => {
  if (!ctx.auth) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Auth required" });
  }
  return next({ ctx });
});

export const requireCompany = t.middleware<{
  ctx: BaseContext;
  next: { ctx: CompanyContext };
}>(({ ctx, next }) => {
  if (!ctx.auth?.companyId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No company access" });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.auth.userId,
      companyId: ctx.auth.companyId,
      role: ctx.auth.role!,
    },
  });
});

/* export const requireRole = t.middleware<{
    ctx: CompanyContext;
  }>(({ ctx, next }) => {
    if (!ctx.auth?.role.includes(ctx.role)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient role" });
    }
    return next();
  }); */
