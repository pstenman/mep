import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mep/ui";
import { useTranslations } from "next-intl";

interface ConfirmationCardProps {
  email: string;
  subscription: {
    plan: string;
    amount: string;
    status: string;
    startDate?: string;
  };
}

export function ConfirmationCard({
  email,
  subscription,
}: ConfirmationCardProps) {
  const t = useTranslations("public");
  return (
    <Card className="w-full border-none sm:max-w-md">
      <CardHeader>
        <CardTitle>{t("subscribe.form.confirmation.title")}</CardTitle>
        <CardDescription>
          {t("subscribe.form.confirmation.description")} {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>{t("subscribe.form.confirmation.plan")}</strong>{" "}
          {subscription.plan}
        </div>
        <div>
          <strong>{t("subscribe.form.confirmation.amount")}</strong>{" "}
          {subscription.amount}
        </div>
        <div>
          <strong>{t("subscribe.form.confirmation.status")}</strong>{" "}
          {subscription.status}
        </div>
        {subscription.startDate && (
          <div>
            <strong>{t("subscribe.form.confirmation.startDate")}</strong>{" "}
            {subscription.startDate}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
