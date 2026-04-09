import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

const createId = () => crypto.randomUUID();

export const crewRoleEnum = pgEnum("crew_role", [
	"HACKER",
	"PILOT",
	"MUSCLE",
	"GRIFTER",
	"ENGINEER",
]);

export const missionStatusEnum = pgEnum("mission_status", [
	"PLANNING",
	"READY",
	"COMMITTED",
]);

export const toolCategoryEnum = pgEnum("tool_category", [
	"INFILTRATION",
	"SURVEILLANCE",
	"SOCIAL",
	"DEMOLITION",
	"ESCAPE",
]);

export const faction = pgTable("faction", {
	id: text("id").$defaultFn(createId).primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ship = pgTable("ship", {
	id: text("id").$defaultFn(createId).primaryKey(),
	name: text("name").notNull().unique(),
	shipClass: text("ship_class").notNull(),
	stealthRating: integer("stealth_rating").notNull(),
	cargoSlots: integer("cargo_slots").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const crewMember = pgTable(
	"crew_member",
	{
		id: text("id").$defaultFn(createId).primaryKey(),
		name: text("name").notNull(),
		callSign: text("call_sign").notNull().unique(),
		role: crewRoleEnum("role").notNull(),
		bio: text("bio").notNull(),
		active: boolean("active").default(true).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("crew_member_role_idx").on(table.role)]
);

export const tool = pgTable(
	"tool",
	{
		id: text("id").$defaultFn(createId).primaryKey(),
		name: text("name").notNull().unique(),
		category: toolCategoryEnum("category").notNull(),
		description: text("description").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("tool_category_idx").on(table.category)]
);

export const mission = pgTable(
	"mission",
	{
		id: text("id").$defaultFn(createId).primaryKey(),
		codeName: text("code_name").notNull().unique(),
		targetName: text("target_name").notNull(),
		destination: text("destination").notNull(),
		summary: text("summary").notNull(),
		payout: integer("payout").notNull(),
		riskLevel: integer("risk_level").notNull(),
		status: missionStatusEnum("status").default("PLANNING").notNull(),
		factionId: text("faction_id")
			.notNull()
			.references(() => faction.id),
		shipId: text("ship_id").references(() => ship.id),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("mission_faction_id_idx").on(table.factionId),
		index("mission_ship_id_idx").on(table.shipId),
		index("mission_status_idx").on(table.status),
	]
);

export const missionCrewAssignment = pgTable(
	"mission_crew_assignment",
	{
		missionId: text("mission_id")
			.notNull()
			.references(() => mission.id, { onDelete: "cascade" }),
		crewMemberId: text("crew_member_id")
			.notNull()
			.references(() => crewMember.id, { onDelete: "cascade" }),
		assignmentOrder: integer("assignment_order").notNull(),
		assignedAt: timestamp("assigned_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.missionId, table.crewMemberId],
			name: "mission_crew_assignment_pk",
		}),
		index("mission_crew_assignment_crew_member_id_idx").on(table.crewMemberId),
	]
);

export const missionToolAssignment = pgTable(
	"mission_tool_assignment",
	{
		missionId: text("mission_id")
			.notNull()
			.references(() => mission.id, { onDelete: "cascade" }),
		toolId: text("tool_id")
			.notNull()
			.references(() => tool.id, { onDelete: "cascade" }),
		quantity: integer("quantity").default(1).notNull(),
		assignedAt: timestamp("assigned_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.missionId, table.toolId],
			name: "mission_tool_assignment_pk",
		}),
		index("mission_tool_assignment_tool_id_idx").on(table.toolId),
	]
);

export const factionRelations = relations(faction, ({ many }) => ({
	missions: many(mission),
}));

export const shipRelations = relations(ship, ({ many }) => ({
	missions: many(mission),
}));

export const crewMemberRelations = relations(crewMember, ({ many }) => ({
	missionAssignments: many(missionCrewAssignment),
}));

export const toolRelations = relations(tool, ({ many }) => ({
	missionAssignments: many(missionToolAssignment),
}));

export const missionRelations = relations(mission, ({ many, one }) => ({
	faction: one(faction, {
		fields: [mission.factionId],
		references: [faction.id],
	}),
	ship: one(ship, {
		fields: [mission.shipId],
		references: [ship.id],
	}),
	crewAssignments: many(missionCrewAssignment),
	toolAssignments: many(missionToolAssignment),
}));

export const missionCrewAssignmentRelations = relations(
	missionCrewAssignment,
	({ one }) => ({
		mission: one(mission, {
			fields: [missionCrewAssignment.missionId],
			references: [mission.id],
		}),
		crewMember: one(crewMember, {
			fields: [missionCrewAssignment.crewMemberId],
			references: [crewMember.id],
		}),
	})
);

export const missionToolAssignmentRelations = relations(
	missionToolAssignment,
	({ one }) => ({
		mission: one(mission, {
			fields: [missionToolAssignment.missionId],
			references: [mission.id],
		}),
		tool: one(tool, {
			fields: [missionToolAssignment.toolId],
			references: [tool.id],
		}),
	})
);
