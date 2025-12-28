ALTER TABLE "prep_lists" RENAME COLUMN "date" TO "schedule_for";--> statement-breakpoint
ALTER TABLE "prep_lists" DROP COLUMN "is_active";