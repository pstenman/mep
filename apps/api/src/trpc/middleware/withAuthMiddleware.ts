import { TRPCError } from "@trpc/server";
import { t } from "../server";
import type { Role } from "@mep/types";

export const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  if (!ctx.auth?.companyId || !ctx.auth?.role) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Company access required",
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

export const requireUserId = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.auth.userId,
    },
  });
});

export const requireCompany = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.companyId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No company access",
    });
  }

  return next();
});

export const requireRole = (roles: Role | Role[]) => {
  const allowed = (Array.isArray(roles) ? roles : [roles]).map((r) =>
    r.toUpperCase(),
  );

  return t.middleware(({ ctx, next }) => {
    if (!ctx.auth?.role || !allowed.includes(ctx.auth.role.toUpperCase())) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Insufficient role",
      });
    }

    return next();
  });
};
