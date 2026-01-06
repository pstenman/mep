"use client";

import Link from "next/link";
import { Button, Text } from "@mep/ui";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("public.hero");
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
          {t("title")}
        </h1>
        <Text className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("subtitle")}
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/subscribe">
              {t("getStarted")}
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8">
            <Link href="#features">{t("learnMore")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
