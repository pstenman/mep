import { PrepType } from "@mep/types";
import { z } from "zod";

export const updateCompanySettingsSchema = z.object({
  enabledPrepTypes: z.array(z.enum(Object.values(PrepType))),
});

export type UpdateCompanySettingsSchema = z.infer<
  typeof updateCompanySettingsSchema
>;
