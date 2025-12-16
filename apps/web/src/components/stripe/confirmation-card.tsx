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
        <CardTitle>{t("subscribe.confirmation.title")}</CardTitle>
        <CardDescription>
          {t("subscribe.confirmation.title")} {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>Plan:</strong> {subscription.plan}
        </div>
        <div>
          <strong>Amount:</strong> {subscription.amount}
        </div>
        <div>
          <strong>Status:</strong> {subscription.status}
        </div>
        {subscription.startDate && (
          <div>
            <strong>Start Date:</strong> {subscription.startDate}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
