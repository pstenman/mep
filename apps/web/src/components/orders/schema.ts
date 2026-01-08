import { z } from "zod";

export function orderItemsSchema(t: (key: string) => string) {
  return z.object({
    orderItems: z.array(
      z.object({
        name: z.string().min(1, t("form.validation.nameRequired")),
        quantity: z.number().min(0, t("form.validation.quantityMin")),
        unit: z.string().min(1, t("form.validation.unitRequired")),
      }),
    ),
  });
}
