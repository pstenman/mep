import { userQueries, db, type UserFilters, users } from "@mep/db";
import type {
  CreateUserSchema,
  userFiltersSchema,
  UpdateUserSchema,
  UpdateCurrentUserSchema,
} from "./schema";
import type { z } from "zod";
import type { paginationSchema, sortingSchema } from "@/lib/schemas";
import { MembershipService } from "../memberships/service";
import { MembershipStatus } from "@mep/types";
import { AuthService } from "../auth/service";
import { eq } from "drizzle-orm";

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

    await AuthService.sendMagicLinkOnPaymentSuccess(result.user.supabaseId);

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
}
