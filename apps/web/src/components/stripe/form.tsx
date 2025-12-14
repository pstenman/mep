"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from "@mep/ui";
import { Controller, useForm } from "react-hook-form";

export function SubscribeForm() {
  const form = useForm();

  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return (
    <Card className="w-full border-none sm:max-w-md">
      <CardHeader>
        <CardTitle>Subscribe</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup>
              <Controller
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>First Name</FieldLabel>
                    <Input {...field} placeholder="First Name" />
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Last Name</FieldLabel>
                    <Input {...field} placeholder="Last Name" />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <FieldGroup>
            <Controller
              name="companyName"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input {...field} placeholder="Company Name" />
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
