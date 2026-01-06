"use client";

import Link from "next/link";
import { Button, Card, CardContent, Text } from "@mep/ui";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function CTA() {
  const t = useTranslations("public.cta");
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-12 pb-12 px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("title")}
            </h2>
            <Text className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("subtitle")}
            </Text>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/subscribe">
                {t("button")}
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
