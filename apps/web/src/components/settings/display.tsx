import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mep/ui";
import { SubscriptionPanel } from "./subscription-panel";
import { CompanyPanel } from "./company-panel";
import { UsersPanel } from "./users-panel";
import { PersonalPanel } from "./personal-panel";
import { useTranslations } from "next-intl";

export function SettingsDisplay() {
  const t = useTranslations("settings");
  return (
    <Accordion type="multiple" className="space-y-4">
      <AccordionItem value="subscription">
        <AccordionTrigger>{t("subscription.title")}</AccordionTrigger>
        <AccordionContent>
          <SubscriptionPanel />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="company">
        <AccordionTrigger>{t("company.title")}</AccordionTrigger>
        <AccordionContent>
          <CompanyPanel />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Users">
        <AccordionTrigger>{t("users.title")}</AccordionTrigger>
        <AccordionContent>
          <UsersPanel />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Personal">
        <AccordionTrigger>{t("personal.title")}</AccordionTrigger>
        <AccordionContent>
          <PersonalPanel />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
