import { z } from "zod";

export const createSubscribeSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, t("subscribe.form.validation.required")),
    lastName: z.string().min(1, t("subscribe.form.validation.required")),
    companyName: z.string().min(1, t("subscribe.form.validation.required")),
    email: z.email(t("subscribe.form.validation.email")),
    companyRegistrationNumber: z
      .string()
      .min(1, t("subscribe.form.validation.required")),
  });
