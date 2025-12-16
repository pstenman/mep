import { z } from "zod";

export const authUserSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export const createAuthUserSchema = authUserSchema

