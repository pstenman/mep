ALTER TABLE "allergies" DROP CONSTRAINT "allergies_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "allergies" DROP CONSTRAINT "allergies_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "allergies" DROP CONSTRAINT "allergies_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "allergies" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "allergies" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "allergies" DROP COLUMN "updated_by";