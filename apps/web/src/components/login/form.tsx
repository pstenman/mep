"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldGroup,
  Field,
  FieldLabel,
  Input,
  FieldDescription,
  Button,
  FieldSeparator,
  Text,
} from "@mep/ui";
import { Controller, useForm } from "react-hook-form";
import { type LoginFormValues, loginSchema } from "./schema";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ForgotPasswordModal } from "./reset-dialog";
import { createBrowserClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

export function LoginForm() {
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const t = useTranslations("auth");
  const router = useRouter();
  const sendMagicLink = trpc.auth.sendMagicLink.useMutation();

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");

  const onSubmit = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error(error);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <Text className="text-2xl font-bold">{t("form.title")}</Text>
            <Text className="text-muted-foreground text-sm text-balance">
              {t("form.descriptionTitle")}
            </Text>
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="email">{t("form.label.email")}</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  placeholder={t("form.placeholder.email")}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">
                    {t("form.label.password")}
                  </FieldLabel>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                  >
                    {t("form.link.forgotPassword")}
                  </Button>
                </div>
                <Input {...field} id="password" type="password" />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("form.label.button.loggingIn")
                : t("form.label.button.login")}
            </Button>
          </Field>

          <FieldSeparator>{t("form.separator.continueWith")}</FieldSeparator>

          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                if (!emailValue || !emailValue.includes("@")) {
                  toast.error(t("form.validation.email"));
                  return;
                }
                setIsMagicLinkLoading(true);
                try {
                  await sendMagicLink.mutateAsync({ email: emailValue });
                  toast.success(t("form.toast.magicLinkSent"));
                } catch (err: any) {
                  toast.error(err?.message || t("form.toast.magicLinkError"));
                } finally {
                  setIsMagicLinkLoading(false);
                }
              }}
              disabled={isMagicLinkLoading || sendMagicLink.isPending}
            >
              <Mail className="w-4 h-4 mr-2" />
              {isMagicLinkLoading || sendMagicLink.isPending
                ? t("form.label.button.sendingLink")
                : t("form.label.button.signInWithLink")}
            </Button>

            <FieldDescription className="text-center">
              {t("form.description.signUp")}{" "}
              <Text asChild>
                <Link
                  href="/subscribe"
                  className="underline underline-offset-4"
                >
                  {t("form.link.signUp")}
                </Link>
              </Text>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSuccess={() => console.log("Reset successfull")}
      />
    </>
  );
}
