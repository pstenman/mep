import { z } from "zod";

export const createStripeCustomerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email("Must be a valid email"),
  companyName: z.string().min(1),
});