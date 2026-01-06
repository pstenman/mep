"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from "@mep/ui";
import { CheckCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PlanSkeleton } from "@/components/subscriptions/plan-skeleton";

function formatInterval(interval: string): string {
  return `/${interval}`;
}

export function Pricing() {
  const locale = useLocale();
  const t = useTranslations("public.pricing");
  const { data, isLoading, error } = trpc.plans.getDefault.useQuery({
    locale,
  });

  return (
    <section
      id="pricing"
      className="container mx-auto px-4 py-16 md:py-24 scroll-mt-20 bg-muted/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <Text className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </Text>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {isLoading ? (
              <PlanSkeleton />
            ) : error || !data?.data ? (
              <Card className="border-border bg-card">
                <CardContent className="pt-6 pb-6 text-center">
                  <Text className="text-muted-foreground">{t("error")}</Text>
                </CardContent>
              </Card>
            ) : (
              (() => {
                const plan = data.data;
                const translation = plan.selectedTranslation;

                if (!translation) return null;

                return (
                  <Card className="border-primary border-2 bg-card relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {t("badge")}
                      </span>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        {translation.name}
                      </CardTitle>
                      <CardDescription>
                        {translation.description}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price} kr
                        </span>
                        <span className="text-muted-foreground">
                          {formatInterval(plan.interval)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {t("features.unlimitedRecipes")}
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {t("features.advancedMenuPlanning")}
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {t("features.fullPrepManagement")}
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {t("features.allergyTracking")}
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {t("features.prioritySupport")}
                        </li>
                      </ul>
                      <Button asChild className="w-full">
                        <Link href="/subscribe">{t("getStarted")}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
