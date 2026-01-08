ALTER TABLE "allergies" DROP CONSTRAINT "allergies_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "allergies" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "allergies" ALTER COLUMN "updated_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "allergies" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_name_unique" UNIQUE("name");