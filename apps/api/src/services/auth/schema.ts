import { z } from "zod";

export const authUserOwnerSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
});

export type CreateAuthUserOwnerSchema = z.infer<typeof authUserOwnerSchema>;
