CREATE TABLE "prep_group_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"prep_list_template_id" uuid,
	"menu_item_id" uuid,
	"name" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prep_items_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"prep_group_template_id" uuid,
	"recipe_id" uuid,
	"name" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prep_list_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"menu_id" uuid,
	"is_active" boolean DEFAULT false NOT NULL,
	"prepTypes" text DEFAULT 'breakfast' NOT NULL,
	"name" text NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prep_groups" DROP CONSTRAINT "prep_groups_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "prep_groups" DROP CONSTRAINT "prep_groups_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "prep_items" DROP CONSTRAINT "prep_items_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "prep_items" DROP CONSTRAINT "prep_items_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "prep_groups" ALTER COLUMN "prep_list_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prep_items" ALTER COLUMN "prep_group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prep_lists" ADD COLUMN "prep_list_template_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "prep_lists" ADD COLUMN "prep_types" text DEFAULT 'breakfast' NOT NULL;--> statement-breakpoint
ALTER TABLE "prep_group_templates" ADD CONSTRAINT "prep_group_templates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_group_templates" ADD CONSTRAINT "prep_group_templates_prep_list_template_id_prep_list_templates_id_fk" FOREIGN KEY ("prep_list_template_id") REFERENCES "public"."prep_list_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_group_templates" ADD CONSTRAINT "prep_group_templates_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_items_templates" ADD CONSTRAINT "prep_items_templates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_items_templates" ADD CONSTRAINT "prep_items_templates_prep_group_template_id_prep_group_templates_id_fk" FOREIGN KEY ("prep_group_template_id") REFERENCES "public"."prep_group_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_items_templates" ADD CONSTRAINT "prep_items_templates_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_list_templates" ADD CONSTRAINT "prep_list_templates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_list_templates" ADD CONSTRAINT "prep_list_templates_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_list_templates" ADD CONSTRAINT "prep_list_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_list_templates" ADD CONSTRAINT "prep_list_templates_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_lists" ADD CONSTRAINT "prep_lists_prep_list_template_id_prep_list_templates_id_fk" FOREIGN KEY ("prep_list_template_id") REFERENCES "public"."prep_list_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_groups" DROP COLUMN "is_template";--> statement-breakpoint
ALTER TABLE "prep_groups" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "prep_groups" DROP COLUMN "updated_by";--> statement-breakpoint
ALTER TABLE "prep_items" DROP COLUMN "is_template";--> statement-breakpoint
ALTER TABLE "prep_items" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "prep_items" DROP COLUMN "updated_by";--> statement-breakpoint
ALTER TABLE "prep_lists" DROP COLUMN "prepTypes";