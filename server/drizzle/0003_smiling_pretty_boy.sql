ALTER TABLE "quizes" ADD COLUMN "ownerId" integer;--> statement-breakpoint
ALTER TABLE "quizes" ADD CONSTRAINT "quizes_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;