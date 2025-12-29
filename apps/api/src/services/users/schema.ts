import { Role } from "@mep/types/src";
import { z } from "zod";

export const userSchema = z.object({
  supabaseId: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
});

export const createUserSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  role: z.enum(Object.values(Role)).default(Role.USER),
});

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(Object.values(Role)).default(Role.USER),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(Object.values(Role)).optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UserFiltersSchema = z.infer<typeof userFiltersSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
