DROP INDEX "room_name_id_idx";--> statement-breakpoint
CREATE INDEX "room_created_at_id_idx" ON "room" USING btree ("created_at","id");