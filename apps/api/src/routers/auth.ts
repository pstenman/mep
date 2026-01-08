import { createTRPCRouter } from "@/trpc/server";
import { publicProcedure } from "@/trpc/procedures";
import { AuthService } from "@/services/auth/service";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  sendMagicLink: publicProcedure
    .input(
      z.object({
        email: z.email(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await AuthService.sendMagicLink(input.email);
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to send magic link",
        });
      }
    }),
});
