import { TRPCError } from "@trpc/server";
import { t } from "../server";

export const withAuthMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.auth) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  if (!ctx.auth.companyId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User has no company",
    });
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
