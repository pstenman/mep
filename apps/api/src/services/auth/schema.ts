import { z } from "zod";

export const authUserOwnerSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  companyRegistrationNumber: z.string().min(1),
});

export const sendMagicLinkOnPaymentSuccessSchema = z.object({
  supabaseId: z.string().min(1),
});

export type CreateAuthUserOwnerSchema = z.infer<typeof authUserOwnerSchema>;
export type SendMagicLinkOnPaymentSuccessSchema = z.infer<
  typeof sendMagicLinkOnPaymentSuccessSchema
>;
