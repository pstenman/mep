import { TRPCError } from "@trpc/server";
import { t } from "../server";

export const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.auth) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Auth required" });
  }
  return next({ ctx });
});

export const requireCompany = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.companyId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No company access" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.auth.userId,
      companyId: ctx.auth.companyId,
      role: ctx.auth.role,
    },
  });
});
