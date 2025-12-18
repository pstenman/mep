import { AuthService } from "@/services/auth/service";
import { publicProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import z from "zod";

export const authRouter = createTRPCRouter({
  createOwner: publicProcedure
    .input(
      z.object({
        email: z.email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        companyName: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const data = await AuthService.createUserOwner(input);

      return {
        userId: data.user.id,
        companyId: data.company.id,
      };
    }),
});
