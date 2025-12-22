import { paginationSchema, sortingSchema } from "@/lib/schemas";
import { createUserSchema, userFiltersSchema } from "@/services/users/schema";
import { UserService } from "@/services/users/service";
import { companyProcedure, ownerProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getAll: companyProcedure
    .input(
      z.object({
        pagination: paginationSchema,
        sorting: sortingSchema,
        filter: userFiltersSchema.optional(),
      })
      .partial(),
    )
    .query(async ({ input, ctx }) => {
      const result = await UserService.getAll(ctx.companyId!, input);
      return { data: result };
    }),

  getById: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const user = await UserService.getById(input.id);
      return { data: user };
    }),

  getByEmail: companyProcedure
    .input(z.object({ email: z.email() }))
    .query(async ({ input }) => {
      const user = await UserService.getByEmail(input.email);
      return { data: user };
    }),

    create: ownerProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await UserService.createUser(input, ctx.companyId);
    }),
});

