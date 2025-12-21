"use client";

import type { CreateStripeSubscriptionInput } from "@mep/api";
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
import { stripePromise } from "@/providers/stripe-provider";
import { mapLocale, mapTheme } from "@/utils/stripe";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { StripeConfirmButton } from "@/components/subscriptions/confirm-button";
import { ConfirmationCard } from "./confirmation-card";
import { useCompanySubscription } from "@/hooks/subscriptions/use-company-subscriptions";

interface SubscribeFormProps {
  prefillEmail?: string;
}

export function SubscribeForm({ prefillEmail }: SubscribeFormProps) {
  const t = useTranslations("public");
  const { theme: currentTheme } = useTheme();
  const changeLocale = useLocale();
  const locale = mapLocale(changeLocale);
  const appearance = mapTheme(currentTheme as "light" | "dark" | "system");

  const form = useForm<CreateStripeSubscriptionInput>({
    resolver: zodResolver(createSubscribeSchema(t)),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: prefillEmail || "",
      companyName: "",
      companyRegistrationNumber: "",
    },
  });

  const {
    createSubscription,
    clientSecret,
    subscriptionStatus,
    amount,
    plan,
    loading,
    authError,
    stripeError,
  } = useCompanySubscription();

  const [openStep, setOpenStep] = useState<string | undefined>("details");
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    setPaymentReady(false);
  }, [clientSecret, locale, currentTheme]);

  if (paymentSuccess) {
    return (
      <ConfirmationCard
        email={form.getValues("email")}
        subscription={{
          plan: plan || "Basic",
          amount: amount || "$0",
          status: subscriptionStatus || "incomplete",
        }}
      />
    );
  }

  const handleSubmit = async (values: CreateStripeSubscriptionInput) => {
    console.log("FORM VALUES:", form.getValues());
    try {
      await createSubscription(values);
      setOpenStep("payment");
    } catch (err) {
      console.error("Subscription creation failed:", err);
    }
  };

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
                          <Input {...field} />
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
                          <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="companyRegistrationNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          {t("subscribe.form.label.companyRegistrationNumber")}
                        </FieldLabel>
                        <Input {...field} />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                {(authError || stripeError) && (
                  <p className="text-error">
                    {authError?.message ?? stripeError}
                  </p>
                )}

                <Button type="submit" disabled={loading}>
                  {loading
                    ? t("subscribe.form.button.processing")
                    : t("subscribe.form.button.continue")}
                </Button>
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
