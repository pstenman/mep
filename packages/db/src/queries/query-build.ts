import { asc, desc, type SQL } from "drizzle-orm";

export function buildOrderByConditions(
  fieldMap: Record<string, any>,
  sorts: Array<{ id: string; desc: boolean }> = [
    { id: "createdAt", desc: false },
  ],
): SQL<unknown>[] {
  return sorts.map((sort) => {
    const field = fieldMap[sort.id];
    if (!field) {
      throw new Error(`Field ${sort.id} not found in field map`);
    }
    return sort.desc ? desc(field) : asc(field);
  });
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}
