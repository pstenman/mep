"use client";

import { trpc } from "@/lib/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mep/ui";
import { PlanSkeleton } from "./plan-skeleton";
import { useLocale } from "next-intl";

export function PlanCard() {
  const locale = useLocale();
  const { data, isLoading, error } = trpc.plans.getDefault.useQuery({ locale });

  if (isLoading) return <PlanSkeleton />;
  if (error || !data?.data) return null;

  const plan = data.data;
  const t = plan.selectedTranslation;

  if (!t) return null;

  return (
    <Card className="w-full border-none sm:max-w-md">
      <CardHeader>
        <CardTitle>{t.name}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-lg font-bold">
          {plan.price} kr / {plan.interval}
        </p>
      </CardContent>
    </Card>
  );
}
