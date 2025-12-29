"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Text,
  useForm,
} from "@mep/ui";
import { Loader2 } from "lucide-react";

function createPersonalSchema(t: (key: string) => string) {
  return z.object({
    firstName: z.string().min(1, t("form.validation.required")),
    lastName: z.string().min(1, t("form.validation.required")),
    email: z.email(t("form.validation.email")),
    phoneNumber: z.string().optional(),
  });
}

type PersonalFormData = z.infer<ReturnType<typeof createPersonalSchema>>;

export function PersonalPanel() {
  const t = useTranslations("settings.personal");
  const tUsers = useTranslations("users");
  const utils = trpc.useUtils();

  const { data: userData, isLoading } = trpc.users.getCurrentUser.useQuery();

  const form = useForm<PersonalFormData>({
    resolver: zodResolver(createPersonalSchema(tUsers)),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  // Update form when user data loads
  React.useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [userData, form]);

  const updateUser = trpc.users.updateCurrentUser.useMutation({
    onSuccess: () => {
      utils.users.getCurrentUser.invalidate();
      toast.success(t("updateSuccess") || "Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("updateError") || "Failed to update profile",
      );
    },
  });

  const onSubmit = async (data: PersonalFormData) => {
    await updateUser.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber || undefined,
    });
  };

  const isLoadingForm = updateUser.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <Text>{t("loading") || "Loading user information..."}</Text>
      </div>
    );
  }

  if (!userData?.data) {
    return (
      <div className="flex flex-col gap-4">
        <Text className="text-sm text-muted-foreground">
          {t("description") || "Personal settings"}
        </Text>
        <Text className="text-sm text-muted-foreground">
          {t("error") || "Failed to load user information."}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Text className="text-sm text-muted-foreground">
        {t("description") || "Update your personal information."}
      </Text>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tUsers("form.label.firstName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={tUsers("form.label.firstName")}
                      disabled={isLoadingForm}
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
                  <FormLabel>{tUsers("form.label.lastName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={tUsers("form.label.lastName")}
                      disabled={isLoadingForm}
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
                <FormLabel>{tUsers("form.label.email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={tUsers("form.label.email")}
                    disabled={isLoadingForm}
                  />
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
                <FormLabel>{tUsers("form.label.phoneNumber")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={tUsers("form.label.phoneNumber")}
                    disabled={isLoadingForm}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoadingForm}>
            {isLoadingForm ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("saving") || "Saving..."}
              </>
            ) : (
              t("save") || "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
