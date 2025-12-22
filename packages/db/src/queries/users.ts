import { users } from "@/schema/users";
import { db, type Database } from "..";
import { and, eq, ilike, or } from "drizzle-orm";
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

  whereConditions.push(eq(memberships.companyId, filters.companyId));

  if (filters.search?.trim()) {
    whereConditions.push(
      or(
        ilike(users.email, `%${filters.search}%`),
        ilike(users.firstName, `%${filters.search}%`),
        ilike(users.lastName, `%${filters.search}%`)
      )
    );
  }

  if (filters.role) {
    whereConditions.push(eq(memberships.role, filters.role));
  }

  if (filters.isActive !== undefined) {
    whereConditions.push(eq(users.isActive, filters.isActive));
  }

  return and(...whereConditions);
}

export function buildUserSort(
  sorting: Array<{ id: string; desc: boolean }> = []
) {
  const fieldMap = {
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    phoneNumber: users.phoneNumber,
    isActive: users.isActive,
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

    const whereClauses = buildUserFilters(filters);
    const rows = await db.query.users.findMany({
      with: {
        memberships: true,
      },
      where: whereClauses,
      orderBy: buildUserSort(
        sorting?.length ? sorting : [{ id: "createdAt", desc: false }]
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
  
  getById: async (id: string) => {
    const row = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        memberships: true,
      },
    });
    return row;
  },

  getByEmail: async (email: string) => {
    const row = await db.query.users.findFirst({
      where: eq(users.email, email),
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
