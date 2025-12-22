import { Role } from "@mep/types";
import { z } from "zod";

export function createUserSchema(t: (key: string) => string) {
    return z.object({
        firstName: z.string().min(1, t("form.validation.required")),
        lastName: z.string().min(1, t("form.validation.required")),
        email: z.email(t("form.validation.email")),
        phoneNumber: z.string().optional(),
        role: z.enum(Object.values(Role)).default(Role.USER),
    });
}

export function updateUserSchema(t: (key: string) => string) {
    return createUserSchema(t).partial();
}