import { users } from "@/schema/users";
import { db, type Database } from "..";
import { and, eq, ilike, or, inArray, isNull } from "drizzle-orm";
import type { Role } from "@mep/types";
import { memberships } from "@/schema/memberships";
import { buildOrderByConditions, type PaginationOptions } from "./query-build";

type UserRow = typeof users.$inferSelect;
type UserInsert = typeof users.$inferInsert;

export interface UserFilters {
  companyId: string;
  search?: string;
  role?: Role;
  isActive?: boolean;
}
export function buildUserFilters(filters: UserFilters) {
  const whereConditions = [];

  if (filters.search?.trim()) {
    whereConditions.push(
      or(
        ilike(users.email, `%${filters.search}%`),
        ilike(users.firstName, `%${filters.search}%`),
        ilike(users.lastName, `%${filters.search}%`),
      ),
    );
  }

  if (filters.isActive !== undefined) {
    whereConditions.push(eq(users.isActive, filters.isActive));
  }

  return and(...whereConditions);
}

export function buildUserSort(
  sorting: Array<{ id: string; desc: boolean }> = [],
) {
  const fieldMap = {
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    phoneNumber: users.phoneNumber,
    isActive: users.isActive,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  } as const;
  return buildOrderByConditions(fieldMap, sorting);
}

export const userQueries = {
  getAll: async (
    filters: UserFilters,
    pagination?: PaginationOptions,
    sorting?: Array<{ id: string; desc: boolean }>,
  ) => {
    const { page = 1, limit = 20 } = pagination || {};
    const offset = (page - 1) * limit;

    const membershipFilterConditions = [
      eq(memberships.companyId, filters.companyId),
    ];
    if (filters.role) {
      membershipFilterConditions.push(eq(memberships.role, filters.role));
    }

    const membershipSubquery = db
      .select({ userId: memberships.userId })
      .from(memberships)
      .where(and(...membershipFilterConditions));

    const userIds = await membershipSubquery;
    const userIdArray = userIds.map((m) => m.userId);
    if (userIds.length === 0) {
      return [];
    }

    const whereConditions = [];

    whereConditions.push(inArray(users.id, userIdArray));

    whereConditions.push(isNull(users.deletedAt));
    whereConditions.push(eq(users.isAnonymized, false));

    if (filters.search?.trim()) {
      whereConditions.push(
        or(
          ilike(users.email, `%${filters.search}%`),
          ilike(users.firstName, `%${filters.search}%`),
          ilike(users.lastName, `%${filters.search}%`),
        ),
      );
    }

    if (filters.isActive !== undefined) {
      whereConditions.push(eq(users.isActive, filters.isActive));
    }

    const whereClauses =
      whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0];

    const rows = await db.query.users.findMany({
      with: {
        memberships: {
          where: (m) => eq(m.companyId, filters.companyId),
        },
      },
      where: whereClauses,
      orderBy: buildUserSort(
        sorting?.length ? sorting : [{ id: "createdAt", desc: false }],
      ),
      limit,
      offset,
    });
    return rows;
  },

  create: async (input: UserInsert, executor?: Database): Promise<UserRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(users).values(input).returning();
    return row[0];
  },

  getById: async (id: string, includeDeleted = false) => {
    const whereConditions = [eq(users.id, id)];
    if (!includeDeleted) {
      whereConditions.push(isNull(users.deletedAt));
      whereConditions.push(eq(users.isAnonymized, false));
    }

    const row = await db.query.users.findFirst({
      where: and(...whereConditions),
      with: {
        memberships: true,
      },
    });
    return row;
  },

  getByEmail: async (email: string, includeDeleted = false) => {
    const whereConditions = [eq(users.email, email)];
    if (!includeDeleted) {
      whereConditions.push(isNull(users.deletedAt));
      whereConditions.push(eq(users.isAnonymized, false));
    }

    const row = await db.query.users.findFirst({
      where: and(...whereConditions),
      with: {
        memberships: true,
      },
    });
    return row;
  },

  activate: async (userId: string, db: Database) => {
    return db.update(users).set({ isActive: true }).where(eq(users.id, userId));
  },

  getSupabaseIdByUserId: async (userId: string, db: Database) => {
    const row = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return row?.supabaseId ?? null;
  },
};
