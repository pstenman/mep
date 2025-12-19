import type { useTranslations } from "next-intl";
import { z } from "zod";

export const loginSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z.email(t("form.validation.email")),
    password: z.string().min(6, t("form.validation.password")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;
