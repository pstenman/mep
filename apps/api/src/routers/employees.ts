import { EmployeeService } from "@/services/employee/service";
import { ownerProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { Role } from "@mep/types";
import { z } from "zod";

export const employeeRouter = createTRPCRouter({
  createEmployee: ownerProcedure
    .input(z.object({
      email: z.email(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      role: z.enum(Object.values(Role)),
    }))
    .mutation(async ({ input, ctx }) => {
      return await EmployeeService.create(input, ctx.userId);
    }),
});