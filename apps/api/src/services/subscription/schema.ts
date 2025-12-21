import { z } from "zod";

export const subscriptionSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  companyRegistrationNumber: z.string().min(1),
});

export const subscriptionActivateSchema = z.object({
  userId: z.string().min(1),
  companyId: z.string().min(1),
  membershipId: z.string().min(1),
});

export type SubscriptionActivateSchema = z.infer<
  typeof subscriptionActivateSchema
>;
export type SubscriptionSchema = z.infer<typeof subscriptionSchema>;
