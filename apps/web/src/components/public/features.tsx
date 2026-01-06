"use client";

import { Card, CardDescription, CardHeader, CardTitle, Text } from "@mep/ui";
import { ChefHat, Utensils, ClipboardList, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations("public.features");
  return (
    <section
      id="features"
      className="container mx-auto px-4 py-16 md:py-24 scroll-mt-20"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border hover:shadow-lg transition-shadow bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-foreground">
                {t("recipeManagement.title")}
              </CardTitle>
              <CardDescription>
                {t("recipeManagement.description")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-foreground">
                {t("menuPlanning.title")}
              </CardTitle>
              <CardDescription>{t("menuPlanning.description")}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-foreground">
                {t("orderPrep.title")}
              </CardTitle>
              <CardDescription>{t("orderPrep.description")}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-foreground">
                {t("allergyTracking.title")}
              </CardTitle>
              <CardDescription>
                {t("allergyTracking.description")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
