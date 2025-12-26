ALTER TABLE "prep_lists" DROP CONSTRAINT "unique_date_list";--> statement-breakpoint
ALTER TABLE "prep_lists" ALTER COLUMN "is_active" SET DEFAULT false;
CREATE UNIQUE INDEX prep_lists_one_active_per_type
ON prep_lists (company_id, prep_types)
WHERE is_active = true;