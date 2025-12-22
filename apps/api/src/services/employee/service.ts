import { MembershipStatus, Role } from "@mep/types";
import { AuthService } from "../auth/service";
import { companyQueries, db, membershipQueries, userQueries } from "@mep/db";
import { MembershipService } from "../memberships/service";
import { UserService } from "../users/service";

export interface EmployeeType {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
}

export class EmployeeService {
    static async create(input: EmployeeType, userId: string) {
        const companyMembership = await MembershipService.findCompanyByUserId(userId);

        if (!companyMembership) throw new Error("Company membership not found");

        if (![Role.OWNER, Role.ADMIN].includes(companyMembership.role as Role)) {
            throw new Error("Not allowed to invite users");
          }

        const companyId = companyMembership.companyId;

        
        const supabaseUserId = await AuthService.createUser({
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
        });

        const result = await db.transaction(async (tx) => {
            const user = await UserService.create({
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
    }}