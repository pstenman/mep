import type { CreateUserInput, UserOutput } from "@mep/api";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createUserSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@mep/types";
import { trpc } from "@/lib/trpc/client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetFooter,
  useForm,
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
  onCancel: _onCancel,
}: UserFormProps) {
  const t = useTranslations("users");
  const utils = trpc.useUtils();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema(t)),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      role: (user?.role as Role | undefined) ?? Role.USER,
    },
  });

  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      toast.success(t("form.toast.createSuccess"));
      onSuccess?.();
    },
    onError: () => {
      toast.error(t("form.toast.error"));
    },
  });

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      toast.success(t("form.toast.updateSuccess"));
      onSuccess?.();
    },
    onError: () => {
      toast.error(t("form.toast.error"));
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    const formData = {
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phoneNumber: data.phoneNumber,
      role: data.role ?? Role.USER,
    };

    if (user) {
      await updateUser.mutateAsync({
        id: user.id,
        data: formData,
      });
    } else {
      await createUser.mutateAsync(formData);
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.label.firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("form.label.firstName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.label.lastName")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("form.label.lastName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.label.email")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("form.label.email")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.label.phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.label.phoneNumber")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.label.role")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value as Role);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("form.label.role")} />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        className="z-[12001] p-1"
                      >
                        {Object.values(Role).map((role) => (
                          <SelectItem key={role} value={role}>
                            {t(`form.role.${role}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <SheetFooter className="shrink-0 px-6 pb-4 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {user ? t("form.button.update") : t("form.button.create")}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
