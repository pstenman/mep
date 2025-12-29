import { companySettingsQueries } from "@mep/db";
import type { UpdateCompanySettingsSchema } from "./schema";

export class CompanySettingsService {
  static async get(companyId: string) {
    const settings = await companySettingsQueries.getOrCreate(companyId);
    return settings;
  }

  static async update(
    input: UpdateCompanySettingsSchema,
    companyId: string,
  ) {
    const settings = await companySettingsQueries.getOrCreate(companyId);
    const updated = await companySettingsQueries.update(companyId, {
      enabledPrepTypes: input.enabledPrepTypes,
    });
    return updated;
  }
}

