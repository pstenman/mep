import { z } from "zod";

export const userSchema = z.object({
  supabaseId: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
});

export type CreateUserSchema = z.infer<typeof userSchema>;