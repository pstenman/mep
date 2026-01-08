import {
  userQueries,
  db,
  type UserFilters,
  users,
  memberships,
  subscriptionQueries,
  type Database,
} from "@mep/db";
import type {
  CreateUserSchema,
  userFiltersSchema,
  UpdateUserSchema,
  UpdateCurrentUserSchema,
} from "./schema";
import type { z } from "zod";
import type { paginationSchema, sortingSchema } from "@/lib/schemas";
import { MembershipService } from "../memberships/service";
import { MembershipStatus, Role } from "@mep/types";
import { AuthService } from "../auth/service";
import { SubscriptionService } from "../subscription/services";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "@/utils/logger";
import { TRPCError } from "@trpc/server";

export interface DeletionEligibilityResult {
  eligible: boolean;
  reason?: string;
  requiresTransfer?: boolean;
  requiresCancellation?: boolean;
  companies?: Array<{
    id: string;
    name: string;
    hasActiveSubscription: boolean;
  }>;
}

export class UserService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof userFiltersSchema>;
      pagination?: z.infer<typeof paginationSchema>;
      sorting?: z.infer<typeof sortingSchema>;
    },
  ) {
    const { filter, pagination, sorting } = params || {};
    const filters: UserFilters = {
      companyId,
      search: filter?.search,
      role: filter?.role,
      isActive: filter?.isActive,
    };
    const rows = await userQueries.getAll(filters, pagination, sorting);
    return { items: rows };
  }

  static async getById(id: string) {
    return await userQueries.getById(id);
  }

  static async getByEmail(email: string) {
    return await userQueries.getByEmail(email);
  }

  static async getCurrentUser(userId: string) {
    return await userQueries.getById(userId);
  }

  static async createUser(input: CreateUserSchema, companyId: string) {
    const supabaseUserId = await AuthService.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const result = await db.transaction(async (tx) => {
      const user = await userQueries.create(
        {
          supabaseId: supabaseUserId,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
        },
        tx,
      );
      const membership = await MembershipService.create(
        {
          userId: user.id,
          companyId: companyId,
          role: input.role,
          status: MembershipStatus.PENDING,
        },
        tx,
      );
      return { user, membership };
    });

    await AuthService.sendMagicLinkOnPaymentSuccess(result.user.email);

    return result;
  }

  static async update(
    userId: string,
    companyId: string,
    input: UpdateUserSchema,
  ) {
    const existingUser = await userQueries.getById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const membership = await MembershipService.findByUserAndCompany(
      userId,
      companyId,
    );
    if (!membership) {
      throw new Error("User is not a member of this company");
    }

    return await db.transaction(async (tx) => {
      const userUpdates: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string | null;
      }> = {};

      if (input.firstName !== undefined) {
        userUpdates.firstName = input.firstName;
      }
      if (input.lastName !== undefined) {
        userUpdates.lastName = input.lastName;
      }
      if (input.email !== undefined) {
        userUpdates.email = input.email;
      }
      if (input.phoneNumber !== undefined) {
        userUpdates.phoneNumber = input.phoneNumber || null;
      }

      if (Object.keys(userUpdates).length > 0) {
        await tx.update(users).set(userUpdates).where(eq(users.id, userId));
      }

      if (input.role !== undefined) {
        await MembershipService.update(
          userId,
          companyId,
          { role: input.role },
          tx,
        );
      }

      const finalUser = await tx.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
          memberships: {
            where: (m) => eq(m.companyId, companyId),
          },
        },
      });

      return finalUser!;
    });
  }

  static async updateCurrentUser(
    userId: string,
    input: UpdateCurrentUserSchema,
  ) {
    const existingUser = await userQueries.getById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    return await db.transaction(async (tx) => {
      const userUpdates: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string | null;
      }> = {};

      if (input.firstName !== undefined) {
        userUpdates.firstName = input.firstName;
      }
      if (input.lastName !== undefined) {
        userUpdates.lastName = input.lastName;
      }
      if (input.email !== undefined) {
        userUpdates.email = input.email;
      }
      if (input.phoneNumber !== undefined) {
        userUpdates.phoneNumber = input.phoneNumber || null;
      }

      if (Object.keys(userUpdates).length > 0) {
        await tx.update(users).set(userUpdates).where(eq(users.id, userId));
      }

      const finalUser = await tx.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
          memberships: true,
        },
      });

      return finalUser!;
    });
  }

  static async checkDeletionEligibility(
    userId: string,
    executor?: Database,
  ): Promise<DeletionEligibilityResult> {
    const dbOrTx = executor ?? db;

    const user = await userQueries.getById(userId, true);
    if (!user) {
      return {
        eligible: false,
        reason: "User not found",
      };
    }

    if (user.isAnonymized || user.deletedAt) {
      return {
        eligible: false,
        reason: "User is already deleted",
      };
    }

    const userMemberships = await dbOrTx.query.memberships.findMany({
      where: eq(memberships.userId, userId),
      with: {
        company: true,
      },
    });

    const companiesWhereOnlyOwner: Array<{
      id: string;
      name: string;
      hasActiveSubscription: boolean;
    }> = [];

    for (const membership of userMemberships) {
      const membershipRole = String(membership.role || "").toUpperCase();
      const isOwner = membershipRole === Role.OWNER.toUpperCase();

      if (isOwner) {
        const allOwners = await dbOrTx.query.memberships.findMany({
          where: and(
            eq(memberships.companyId, membership.companyId),
            sql`UPPER(${memberships.role}) = UPPER(${Role.OWNER})`,
          ),
        });

        const isOnlyOwner =
          allOwners.length === 1 && allOwners[0]!.userId === userId;

        if (isOnlyOwner) {
          const subscriptionStatus =
            await SubscriptionService.checkSubscriptionStatus(
              membership.companyId,
              dbOrTx,
            );

          const subscription = await subscriptionQueries.findByCompanyId(
            membership.companyId,
            dbOrTx,
          );

          const isSubscriptionCanceled =
            subscription?.cancelAtPeriodEnd ?? false;

          if (!isSubscriptionCanceled) {
            companiesWhereOnlyOwner.push({
              id: membership.companyId,
              name: membership.company?.name || "Unknown Company",
              hasActiveSubscription: subscriptionStatus.isActive,
            });
          }
        }
      }
    }

    if (companiesWhereOnlyOwner.length > 0) {
      const hasActiveSubscriptions = companiesWhereOnlyOwner.some(
        (c) => c.hasActiveSubscription,
      );

      return {
        eligible: false,
        reason: hasActiveSubscriptions
          ? "You are the only owner of companies with active subscriptions. Please transfer ownership or cancel subscriptions before deleting your account."
          : "You are the only owner of one or more companies. Please transfer ownership to another user before deleting your account.",
        requiresTransfer: true,
        requiresCancellation: hasActiveSubscriptions,
        companies: companiesWhereOnlyOwner,
      };
    }

    return {
      eligible: true,
    };
  }

  static async anonymizeUser(userId: string, executor?: Database) {
    const dbOrTx = executor ?? db;
    const user = await userQueries.getById(userId, true);

    if (!user) {
      throw new Error("User not found");
    }

    const anonymizedEmail = `deleted-${user.id}@deleted.local`;
    const now = new Date();

    await dbOrTx
      .update(users)
      .set({
        email: anonymizedEmail,
        firstName: "Deleted User",
        lastName: "",
        phoneNumber: null,
        image: null,
        isAnonymized: true,
        deletedAt: now,
        anonymizedAt: now,
        isActive: false,
        updatedAt: now,
      })
      .where(eq(users.id, userId));

    logger.info({ userId }, "User anonymized");
  }

  static async anonymizeRelatedRecords(_userId: string, _executor?: Database) {
    logger.info(
      { userId: _userId },
      "Related records will show anonymized user data",
    );
  }

  static async requestDeletion(userId: string) {
    const eligibility = await UserService.checkDeletionEligibility(userId);

    if (!eligibility.eligible) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: eligibility.reason || "User cannot be deleted",
        cause: {
          requiresTransfer: eligibility.requiresTransfer,
          requiresCancellation: eligibility.requiresCancellation,
          companies: eligibility.companies,
        },
      });
    }

    const user = await userQueries.getById(userId, true);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    await db.transaction(async (tx) => {
      await UserService.anonymizeUser(userId, tx);
      await UserService.anonymizeRelatedRecords(userId, tx);
    });

    await AuthService.deleteUser(user.supabaseId);

    logger.info({ userId }, "User deletion completed");

    return { success: true, message: "Account deleted successfully" };
  }
}
