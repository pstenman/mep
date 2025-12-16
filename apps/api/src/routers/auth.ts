import { AuthService } from "@/services/auth/service";
import { publicProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import z from "zod";

export const authRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        email: z.email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await AuthService.createUserWithMagicLink(input);
      return { success: true };
    }),
});