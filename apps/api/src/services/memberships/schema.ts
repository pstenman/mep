import { MembershipStatus, Role } from "@mep/types";
import { z } from "zod";

export const membershipSchema = z.object({
  userId: z.string(),
  companyId: z.string(),
  role: z.enum(Object.values(Role)),
  status: z.enum(Object.values(MembershipStatus)),
});

export type CreateMembershipSchema = z.infer<typeof membershipSchema>;
