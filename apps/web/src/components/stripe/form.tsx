"use client";

import type { CreateSetupIntentInput } from "@mep/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@mep/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubscribeSchema } from "./schema";
import { useSetupIntent } from "@/hooks/stripe/useSetupIntent";
import { stripePromise } from "@/providers/stripe-provider";
import { mapLocale, mapTheme } from "@/utils/stripe";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { StripeConfirmButton } from "@/components/stripe/confirm-button";
import { useQueryState } from "nuqs";
import { ConfirmationCard } from "./confirmation-card";

interface SubscribeFormProps {
  prefillEmail?: string;
}

export function SubscribeForm({ prefillEmail }: SubscribeFormProps) {
  const { theme: currentTheme } = useTheme();
  const changeLocale = useLocale();
  const locale = mapLocale(changeLocale);
  const appearance = mapTheme(currentTheme as "light" | "dark" | "system");
  const t = useTranslations("public");

  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [clientSecret, setClientSecret] = useQueryState(
    "setup_intent_client_secret",
    { defaultValue: "" },
  );

  const { create, loading: setupLoading, error: setupError } = useSetupIntent();

  const form = useForm<CreateSetupIntentInput>({
    resolver: zodResolver(createSubscribeSchema(t)),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: prefillEmail || "",
      companyName: "",
    },
  });

  const [openStep, setOpenStep] = useState<string | undefined>("details");
  const loading = setupLoading;
  const error = setupError;

  const handleSubmit = async (values: CreateSetupIntentInput) => {
    // ADD: auth
    try {
      const secret = await create(values);
      setClientSecret(secret);
      setOpenStep("payment");
    } catch (err) {
      console.error("error", err);
    }
  };

  useEffect(() => {
    setPaymentReady(false);
  }, [clientSecret, locale, currentTheme]);

  if (paymentSuccess) {
    return (
      <ConfirmationCard
        email={form.getValues("email")}
        subscription={{ plan: "basic", amount: "$10", status: "active" }}
      />
    );
  }

  return (
    <Card className="w-full border-none sm:max-w-md">
      <CardHeader>
        <CardTitle>{t("subscribe.form.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          value={openStep}
          onValueChange={setOpenStep}
        >
          <AccordionItem value="details">
            <AccordionTrigger>
              {t("subscribe.form.headers.details")}
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup>
                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            {t("subscribe.form.label.firstName")}
                          </FieldLabel>
                          <Input {...field} disabled={openStep === "payment"} />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="lastName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            {t("subscribe.form.label.lastName")}
                          </FieldLabel>
                          <Input {...field} disabled={openStep === "payment"} />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          {t("subscribe.form.label.email")}
                        </FieldLabel>
                        <Input {...field} disabled={openStep === "payment"} />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="companyName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          {t("subscribe.form.label.companyName")}
                        </FieldLabel>
                        <Input {...field} disabled={openStep === "payment"} />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                {error && <p className="text-error">{error}</p>}

                {openStep !== "payment" && (
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? t("subscribe.form.button.processing")
                      : t("subscribe.form.button.continue")}
                  </Button>
                )}
              </form>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="payment"
            disabled={!clientSecret || openStep !== "payment"}
          >
            <AccordionTrigger>
              {t("subscribe.form.headers.payment")}
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, locale, appearance }}
                >
                  <div className="space-y-4">
                    <PaymentElement onReady={() => setPaymentReady(true)} />
                    <StripeConfirmButton
                      paymentReady={paymentReady}
                      loading={loading}
                      onError={(msg) => console.error("Stripe error:", msg)}
                      onSuccess={() => setPaymentSuccess(true)}
                    />
                  </div>
                </Elements>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
