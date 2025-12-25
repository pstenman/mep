CREATE TABLE "prep_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"menu_id" uuid,
	"prepTypes" text DEFAULT 'breakfast' NOT NULL,
	"name" text NOT NULL,
	"date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_date_list" UNIQUE("company_id","date","prepTypes")
);
--> statement-breakpoint
ALTER TABLE "prep_groups" ADD COLUMN "prep_list_id" uuid;--> statement-breakpoint
ALTER TABLE "prep_lists" ADD CONSTRAINT "prep_lists_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_lists" ADD CONSTRAINT "prep_lists_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_lists" ADD CONSTRAINT "prep_lists_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_lists" ADD CONSTRAINT "prep_lists_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_groups" ADD CONSTRAINT "prep_groups_prep_list_id_prep_lists_id_fk" FOREIGN KEY ("prep_list_id") REFERENCES "public"."prep_lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_groups" DROP COLUMN "prepTypes";