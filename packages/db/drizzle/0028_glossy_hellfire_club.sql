ALTER TABLE "prep_lists" ALTER COLUMN "schedule_for" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "prep_lists" ALTER COLUMN "schedule_for" SET NOT NULL;