import { membershipQueries, db, type Database } from "@mep/db";
import type { CreateMembershipSchema } from "./schema";

export class MembershipService {
  static async create(input: CreateMembershipSchema, executor?: Database) {
    return await membershipQueries.create(input, executor);
  }

  static async activate(membershipId: string, executor?: Database) {
    if (!membershipId) throw new Error("Membership ID is required");
    return await membershipQueries.activate(membershipId, executor ?? db);
  }

  static async findByUserAndCompany(userId: string, companyId: string) {
    if (!userId || !companyId) throw new Error("User ID and company ID are required");
    return await membershipQueries.findByUserAndCompany(userId, companyId);
  }
  static async findCompanyByUserId(userId: string) {
    if (!userId) throw new Error("User ID is required");
    return await membershipQueries.findCompanyByUserId(userId);
  }
}