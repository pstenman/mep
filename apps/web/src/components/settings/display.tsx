import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mep/ui";
import { SubscriptionPanel } from "./subscription-panel";

export function SettingsDisplay() {
  return (
    <Accordion type="multiple" className="space-y-4">
      <AccordionItem value="subscription">
        <AccordionTrigger>Subscription</AccordionTrigger>
        <AccordionContent>
          <SubscriptionPanel />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="company">
        <AccordionTrigger>Company Setting</AccordionTrigger>
        <AccordionContent>Company</AccordionContent>
      </AccordionItem>
      <AccordionItem value="Users">
        <AccordionTrigger>Uers Setting</AccordionTrigger>
        <AccordionContent>Users</AccordionContent>
      </AccordionItem>
      <AccordionItem value="Personal">
        <AccordionTrigger>Personal Setting</AccordionTrigger>
        <AccordionContent>Personal</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
