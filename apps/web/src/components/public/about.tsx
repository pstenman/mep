"use client";

import { Card, CardContent, Text } from "@mep/ui";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function About() {
  const t = useTranslations("public.about");
  return (
    <section
      id="about"
      className="container mx-auto px-4 py-16 md:py-24 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("title")}
            </h2>
            <Text className="text-lg text-muted-foreground mb-4">
              {t("description1")}
            </Text>
            <Text className="text-lg text-muted-foreground mb-6">
              {t("description2")}
            </Text>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <Text>{t("trustedBy")}</Text>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  1000+
                </div>
                <Text className="text-sm text-muted-foreground">
                  {t("stats.activeUsers")}
                </Text>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  50K+
                </div>
                <Text className="text-sm text-muted-foreground">
                  {t("stats.recipesManaged")}
                </Text>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  99%
                </div>
                <Text className="text-sm text-muted-foreground">
                  {t("stats.uptime")}
                </Text>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  24/7
                </div>
                <Text className="text-sm text-muted-foreground">
                  {t("stats.support")}
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
