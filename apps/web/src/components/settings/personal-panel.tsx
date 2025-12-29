"use client";

import React, { useState } from "react";
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
  Separator,
} from "@mep/ui";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";

function createPersonalSchema(t: (key: string) => string) {
  return z.object({
    firstName: z.string().min(1, t("form.validation.required")),
    lastName: z.string().min(1, t("form.validation.required")),
    email: z.email(t("form.validation.email")),
    phoneNumber: z.string().optional(),
  });
}

function createPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      newPassword: z.string().min(6, t("password.newPassword.minLength")),
      confirmPassword: z
        .string()
        .min(1, t("password.confirmPassword.required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("password.confirmPassword.mismatch"),
      path: ["confirmPassword"],
    });
}

type PersonalFormData = z.infer<ReturnType<typeof createPersonalSchema>>;
type PasswordFormData = z.infer<ReturnType<typeof createPasswordSchema>>;

export function PersonalPanel() {
  const t = useTranslations("settings.personal");
  const tUsers = useTranslations("users");
  const { supabase } = useAuth();
  const utils = trpc.useUtils();

  const { data: userData, isLoading } = trpc.users.getCurrentUser.useQuery();

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const personalForm = useForm<PersonalFormData>({
    resolver: zodResolver(createPersonalSchema(tUsers)),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(createPasswordSchema(t)),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      personalForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [userData, personalForm]);

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

  const onSubmitPersonal = async (data: PersonalFormData) => {
    await updateUser.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber || undefined,
    });
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        toast.error(
          updateError.message ||
            t("password.error.updateFailed") ||
            "Failed to update password",
        );
        return;
      }

      toast.success(t("password.success") || "Password updated successfully");
      passwordForm.reset();
      setIsChangingPassword(false);
    } catch (error: any) {
      toast.error(
        error.message ||
          t("password.error.updateFailed") ||
          "Failed to update password",
      );
    }
  };

  const isLoadingPersonalForm = updateUser.isPending;
  const isLoadingPasswordForm = passwordForm.formState.isSubmitting;

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
    <div className="flex flex-col gap-6">
      <Text className="text-sm text-muted-foreground">
        {t("description") || "Update your personal information."}
      </Text>

      <Form {...personalForm}>
        <form
          onSubmit={personalForm.handleSubmit(onSubmitPersonal)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              name="firstName"
              control={personalForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tUsers("form.label.firstName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={tUsers("form.label.firstName")}
                      disabled={isLoadingPersonalForm}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={personalForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tUsers("form.label.lastName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={tUsers("form.label.lastName")}
                      disabled={isLoadingPersonalForm}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="email"
            control={personalForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tUsers("form.label.email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={tUsers("form.label.email")}
                    disabled={isLoadingPersonalForm}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phoneNumber"
            control={personalForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tUsers("form.label.phoneNumber")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={tUsers("form.label.phoneNumber")}
                    disabled={isLoadingPersonalForm}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoadingPersonalForm}>
            {isLoadingPersonalForm ? (
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

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Text className="font-medium">
              {t("password.title") || "Change Password"}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {t("password.description") || "Update your account password."}
            </Text>
          </div>
          {!isChangingPassword && (
            <Button
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
            >
              {t("password.button.change") || "Change Password"}
            </Button>
          )}
        </div>

        {isChangingPassword && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
              className="space-y-4"
            >
              <FormField
                name="newPassword"
                control={passwordForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("password.newPassword.label") || "New Password"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={
                          t("password.newPassword.placeholder") ||
                          "Enter new password"
                        }
                        disabled={isLoadingPasswordForm}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={passwordForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("password.confirmPassword.label") ||
                        "Confirm New Password"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={
                          t("password.confirmPassword.placeholder") ||
                          "Confirm new password"
                        }
                        disabled={isLoadingPasswordForm}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoadingPasswordForm}>
                  {isLoadingPasswordForm ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("password.saving") || "Updating..."}
                    </>
                  ) : (
                    t("password.save") || "Update Password"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    passwordForm.reset();
                  }}
                  disabled={isLoadingPasswordForm}
                >
                  {t("password.cancel") || "Cancel"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
