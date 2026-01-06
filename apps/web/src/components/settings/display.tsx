"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@mep/ui";
import { SubscriptionPanel } from "./subscription-panel";
import { CompanyPanel } from "./company-panel";
import { UsersPanel } from "./users-panel";
import { PersonalPanel } from "./personal-panel";
import { useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc/client";
import { Role } from "@mep/types";
import { Loader2 } from "lucide-react";

export function SettingsDisplay() {
  const t = useTranslations("settings");
  const { data: userData, isLoading: isLoadingUser } =
    trpc.users.getCurrentUser.useQuery();

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const user = userData?.data;
  const membership = user?.memberships?.[0];
  const userRole = membership?.role || Role.USER;

  const isOwner = userRole === Role.OWNER;
  const isAdmin = userRole === Role.ADMIN;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>{t("subscription.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionPanel />
          </CardContent>
        </Card>
      )}

      {(isOwner || isAdmin) && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t("company.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyPanel />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("users.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersPanel />
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("personal.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalPanel />
        </CardContent>
      </Card>
    </div>
  );
}
