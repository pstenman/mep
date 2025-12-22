import { userQueries, db, type UserFilters } from "@mep/db";
import type { CreateUserSchema, userFiltersSchema } from "./schema";
import type { z } from "zod";
import type { paginationSchema, sortingSchema } from "@/lib/schemas";
import { MembershipService } from "../memberships/service";
import { MembershipStatus } from "@mep/types";
import { AuthService } from "../auth/service";

export class UserService {

  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof userFiltersSchema>;
      pagination?: z.infer<typeof paginationSchema>;
      sorting?: z.infer<typeof sortingSchema>;
    },
  ) {
    const { filter, pagination, sorting } = params || {}
    const filters: UserFilters = {
      companyId,
      search: filter?.search,
      role: filter?.role,
      isActive: filter?.isActive,
    }
    const rows = await userQueries.getAll(filters, pagination, sorting);
    return { items: rows };
  }

  static async getById(id: string) {
    return await userQueries.getById(id);
  }

  static async getByEmail(email: string) {
    return await userQueries.getByEmail(email);
  }

  static async createUser(input: CreateUserSchema, companyId: string) {
    const supabaseUserId = await AuthService.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const result = await db.transaction(async (tx) => {
      const user = await userQueries.create({
        supabaseId: supabaseUserId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: input.phoneNumber,
      }, tx);
      const membership = await MembershipService.create({
        userId: user.id,
        companyId: companyId,
        role: input.role,
        status: MembershipStatus.PENDING,
      }, tx);
      return { user, membership };
    });

    await AuthService.sendMagicLinkOnPaymentSuccess(result.user.supabaseId);

    return result;
  }
}