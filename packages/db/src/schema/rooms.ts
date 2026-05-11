import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const createId = () => crypto.randomUUID();

export const room = pgTable(
	"room",
	{
		id: text("id").$defaultFn(createId).primaryKey(),
		name: text("name").notNull().unique(),
		description: text("description").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("room_name_id_idx").on(table.name, table.id)]
);

export const plant = pgTable(
	"plant",
	{
		id: text("id").$defaultFn(createId).primaryKey(),
		roomId: text("room_id")
			.notNull()
			.references(() => room.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		species: text("species").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("plant_name_idx").on(table.name),
		index("plant_room_name_id_idx").on(table.roomId, table.name, table.id),
		index("plant_room_id_idx").on(table.roomId),
	]
);

export const roomRelations = relations(room, ({ many }) => ({
	plants: many(plant),
}));

export const plantRelations = relations(plant, ({ one }) => ({
	room: one(room, {
		fields: [plant.roomId],
		references: [room.id],
	}),
}));
