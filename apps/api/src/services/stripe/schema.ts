import { z } from "zod";

export const createStripeCustomerSchema = z.object({
  email: z.email("Must be a valid email"),
  companyName: z.string().min(1),
  companyRegistrationNumber: z.string().min(1),
  companyId: z.string().min(1),
  membershipId: z.string().min(1),
  userId: z.string().min(1),
});

export type StripeCustomerSchema = z.infer<typeof createStripeCustomerSchema>;
