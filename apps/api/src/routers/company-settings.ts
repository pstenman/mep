import { updateCompanySettingsSchema } from "@/services/company-settings/schema";
import { CompanySettingsService } from "@/services/company-settings/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";

export const companySettingsRouter = createTRPCRouter({
  get: companyProcedure.query(async ({ ctx }) => {
    const settings = await CompanySettingsService.get(ctx.companyId!);
    return { data: settings };
  }),

  update: companyProcedure
    .input(updateCompanySettingsSchema)
    .mutation(async ({ input, ctx }) => {
      const settings = await CompanySettingsService.update(
        input,
        ctx.companyId!,
      );
      return { data: settings };
    }),
});

