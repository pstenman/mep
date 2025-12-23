CREATE TABLE "companies_orders" (
	"company_id" uuid NOT NULL,
	"order_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_orders" (
	"user_id" uuid NOT NULL,
	"order_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies_orders" ADD CONSTRAINT "companies_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies_orders" ADD CONSTRAINT "companies_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_orders" ADD CONSTRAINT "users_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_orders" ADD CONSTRAINT "users_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;