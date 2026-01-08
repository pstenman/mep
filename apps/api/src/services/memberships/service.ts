import { membershipQueries, db, type Database, memberships } from "@mep/db";
import type { CreateMembershipSchema } from "./schema";
import { Role } from "@mep/types";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export class MembershipService {
  static async create(input: CreateMembershipSchema, executor?: Database) {
    return await membershipQueries.create(input, executor);
  }

  static async activate(membershipId: string, executor?: Database) {
    if (!membershipId) throw new Error("Membership ID is required");
    return await membershipQueries.activate(membershipId, executor ?? db);
  }

  static async findByUserAndCompany(userId: string, companyId: string) {
    if (!userId || !companyId)
      throw new Error("User ID and company ID are required");
    return await membershipQueries.findByUserAndCompany(userId, companyId);
  }
  static async findCompanyByUserId(userId: string) {
    if (!userId) throw new Error("User ID is required");
    return await membershipQueries.findCompanyByUserId(userId);
  }

  static async update(
    userId: string,
    companyId: string,
    updates: { role?: Role },
    executor?: Database,
  ) {
    if (!userId || !companyId) {
      throw new Error("User ID and company ID are required");
    }
    return await membershipQueries.update(userId, companyId, updates, executor);
  }

  static async getOwners(companyId: string, executor?: Database) {
    const dbOrTx = executor ?? db;
    const ownerMemberships = await dbOrTx.query.memberships.findMany({
      where: and(
        eq(memberships.companyId, companyId),
        eq(memberships.role, Role.OWNER),
      ),
      with: {
        user: true,
      },
    });
    return ownerMemberships;
  }

  static async validateTransfer(
    companyId: string,
    fromUserId: string,
    toUserId: string,
    executor?: Database,
  ) {
    const dbOrTx = executor ?? db;

    const fromMembership = await membershipQueries.findByUserAndCompany(
      fromUserId,
      companyId,
      dbOrTx,
    );

    if (!fromMembership) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership not found for the current user",
      });
    }

    if (fromMembership.role !== Role.OWNER) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only owners can transfer ownership",
      });
    }

    const toMembership = await membershipQueries.findByUserAndCompany(
      toUserId,
      companyId,
      dbOrTx,
    );

    if (!toMembership) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Target user is not a member of this company",
      });
    }

    if (fromUserId === toUserId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot transfer ownership to yourself",
      });
    }

    return { fromMembership, toMembership };
  }

  static async transferOwnership(
    companyId: string,
    fromUserId: string,
    toUserId: string,
    executor?: Database,
  ) {
    const dbOrTx = executor ?? db;

    await MembershipService.validateTransfer(
      companyId,
      fromUserId,
      toUserId,
      dbOrTx,
    );

    await dbOrTx.transaction(async (tx) => {
      await membershipQueries.update(
        fromUserId,
        companyId,
        { role: Role.USER },
        tx,
      );

      await membershipQueries.update(
        toUserId,
        companyId,
        { role: Role.OWNER },
        tx,
      );
    });

    return { success: true };
  }
}
