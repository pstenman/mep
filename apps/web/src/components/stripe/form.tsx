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
import { useStripeConfirm } from "@/hooks/stripe/useStripeConfirm";
import { stripePromise } from "@/providers/stripe-provider";
import { mapLocale, mapTheme } from "@/utils/stripe";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";

interface SubscribeFormProps {
  prefillEmail?: string;
}

export function SubscribeForm({ prefillEmail }: SubscribeFormProps) {
  const changeLocale = useLocale();
  const locale = mapLocale(changeLocale);
  const { theme: currentTheme } = useTheme();
  const appearance = mapTheme(currentTheme as "light" | "dark" | "system");
  const t = useTranslations("public");

  const {
    clientSecret,
    create,
    loading: setupLoading,
    error: setupError,
  } = useSetupIntent();

  const {
    confirm,
    loading: confirmLoading,
    error: confirmError,
  } = useStripeConfirm(clientSecret, {});

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

  const handleSubmit = async (values: CreateSetupIntentInput) => {
    try {
      await create(values);
    } catch (err) {
      console.error("error", err);
    }
  };

  const loading = setupLoading || confirmLoading;
  const error = setupError || confirmError;

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
                          <Input
                            {...field}
                            placeholder={t(
                              "subscribe.form.placeholder.firstName",
                            )}
                            disabled={!!clientSecret}
                          />
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
                          <Input
                            {...field}
                            placeholder={t(
                              "subscribe.form.placeholder.lastName",
                            )}
                            disabled={!!clientSecret}
                          />
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
                    name="companyName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          {t("subscribe.form.label.companyName")}
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder={t(
                            "subscribe.form.placeholder.companyName",
                          )}
                          disabled={!!clientSecret}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          {t("subscribe.form.label.email")}
                        </FieldLabel>
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("subscribe.form.placeholder.email")}
                          disabled={!!clientSecret}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                {error && <p className="text-error">{error}</p>}

                {!clientSecret && (
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? t("subscribe.form.button.processing")
                      : t("subscribe.form.button.continue")}
                  </Button>
                )}
              </form>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment" disabled={!clientSecret}>
            <AccordionTrigger>
              {t("subscribe.form.headers.payment")}
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              {clientSecret && (
                <Elements
                  key={`${locale}-${currentTheme}`}
                  stripe={stripePromise}
                  options={{ clientSecret, locale, appearance }}
                >
                  <div className="space-y-4">
                    <PaymentElement />

                    {error && <p className="text-error">{error}</p>}

                    <Button
                      onClick={confirm}
                      disabled={loading}
                      className="w-full h-10 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50"
                    >
                      {confirmLoading
                        ? t("subscribe.form.button.confirming")
                        : t("subscribe.form.button.confirmPayment")}
                    </Button>
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
