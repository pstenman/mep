import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordFormValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Button,
  DialogDescription,
} from "@mep/ui";
import { toast } from "sonner";

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: ForgotPasswordProps) {
  const t = useTranslations("auth");

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      // TODO: implement supabase password reset, mocking for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Mock reset email sent for:", data.email);

      toast.success(t("resetPasswordForm.toast.success"));
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || t("resetPasswordForm.toast.success"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-12 md:p-12 rounded-lg">
        <DialogHeader>
          <DialogTitle>{t("resetPasswordForm.title")}</DialogTitle>
          <DialogDescription>
            {t("resetPasswordForm.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder={t("form.placeholder.email")}
                disabled={isSubmitting}
                className={errors.email ? "border-destructive" : ""}
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t("resetPasswordForm.button.sending")
              : t("resetPasswordForm.button.sendReset")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
