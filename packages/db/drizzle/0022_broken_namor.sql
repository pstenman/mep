ALTER TABLE "prep_groups" ADD COLUMN "is_template" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "prep_items" ADD COLUMN "is_template" boolean DEFAULT false NOT NULL;