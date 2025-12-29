CREATE TABLE "company_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"enabled_prep_types" jsonb DEFAULT '["main","breakfast","lunch","al-a-carte","set","group"]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_settings_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
ALTER TABLE "prep_items" ALTER COLUMN "status" SET DEFAULT 'N';--> statement-breakpoint
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;