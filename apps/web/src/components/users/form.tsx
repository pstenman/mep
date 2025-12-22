import type { CreateUserInput, UserOutput } from "@mep/api";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createUserSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@mep/types";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { trpc } from "@/lib/trpc/client";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetFooter,
} from "@mep/ui";

interface UserFormProps {
  user?: UserOutput | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "sheet" | "popover";
}

export function UserForm({
  user,
  onSuccess,
  onCancel,
  variant = "sheet",
}: UserFormProps) {
  const t = useTranslations("users");
  const utils = trpc.useUtils();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema(t)),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      role: user?.role || Role.USER,
    },
  });

  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      toast.success(t("form.success"));
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      toast.success(t("form.success"));
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
    };

    if (user) {
      await updateUser.mutateAsync({
        id: user.id,
        data: formData,
      });
    } else {
      await createUser.mutateAsync({ data: formData });
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  const handleError = (error: FieldErrors<CreateUserInput>) => {
    toast.error(error.message);
  };

  const roles = Object.values(Role);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, handleError)}
      className={
        variant === "sheet"
          ? "h-full flex flex-col overflow-y-auto"
          : "h-full flex flex-col"
      }
    >
      <div
        className={`space-y-4 ${variant === "sheet" ? "flex-1 overflow-y-auto" : "flex-1 overflow-y-auto min-h-0"}`}
      >
        <FieldGroup>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("form.label.firstName")}</FieldLabel>
                <Input {...field} placeholder={t("form.label.firstName")} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("form.label.lastName")}</FieldLabel>
                <Input {...field} placeholder={t("form.label.lastName")} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("form.label.email")}</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder={t("form.label.email")}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("form.label.phoneNumber")}</FieldLabel>
                <Input {...field} placeholder={t("form.label.phoneNumber")} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("form.label.role")}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("form.label.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {t(`form.role.${role}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>
      {variant === "sheet" ? (
        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("form.button.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {user ? t("form.button.update") : t("form.button.create")}
          </Button>
        </SheetFooter>
      ) : (
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("form.button.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {user ? t("form.button.update") : t("form.button.create")}
          </Button>
        </div>
      )}
    </form>
  );
}
