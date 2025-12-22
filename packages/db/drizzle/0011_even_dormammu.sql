CREATE TABLE "company_sidebar_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"settings" jsonb DEFAULT '{"hiddenItemIds":[]}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_sidebar_settings" ADD CONSTRAINT "company_sidebar_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;