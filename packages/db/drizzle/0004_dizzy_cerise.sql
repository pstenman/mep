CREATE TABLE "plan_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" integer NOT NULL,
	"interval" text NOT NULL,
	"stripe_price_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plan_translations" ADD CONSTRAINT "plan_translations_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;