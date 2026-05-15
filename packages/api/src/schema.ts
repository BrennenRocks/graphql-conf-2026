import { Buffer } from "node:buffer";

import { db } from "@graphql-conf/db";
import { plant, room } from "@graphql-conf/db/schema/rooms";
import { and, asc, count, desc, eq, gt, lt, ne, or, sql } from "drizzle-orm";
import { GraphQLError } from "graphql";
import gql from "graphql-tag";
import z from "zod";

const defaultRoomListLimit = 8;
const maxRoomListLimit = 50;
const defaultRoomConnectionPageSize = 8;
const maxRoomConnectionPageSize = 50;
const defaultPlantConnectionPageSize = 24;
const maxPlantConnectionPageSize = 50;
const plantIdSchema = z.string().uuid("Plant id must be a valid UUID");
const roomIdSchema = z.string().uuid("Room id must be a valid UUID");
const optionalPlantIdSchema = z
	.string()
	.uuid("Plant id must be a valid UUID")
	.optional();
const optionalRoomIdSchema = z
	.string()
	.uuid("Room id must be a valid UUID")
	.optional();
const roomNameSchema = z.string().trim().min(1, "Room name is required");
const roomDescriptionSchema = z
	.string()
	.trim()
	.min(1, "Room description is required");
const plantNameSchema = z.string().trim().min(1, "Plant name is required");
const plantSpeciesSchema = z
	.string()
	.trim()
	.min(1, "Plant species is required");
const createRoomInputSchema = z.object({
	description: roomDescriptionSchema,
	id: optionalRoomIdSchema,
	name: roomNameSchema,
});
const updateRoomInputSchema = z.object({
	description: roomDescriptionSchema,
	id: roomIdSchema,
	name: roomNameSchema,
});
const createPlantInputSchema = z.object({
	id: optionalPlantIdSchema,
	name: plantNameSchema,
	roomId: roomIdSchema,
	species: plantSpeciesSchema,
});
const updatePlantInputSchema = z.object({
	id: plantIdSchema,
	name: plantNameSchema,
	roomId: roomIdSchema,
	species: plantSpeciesSchema,
});
const roomsArgsSchema = z.object({
	limit: z.preprocess(
		(value) => value ?? undefined,
		z
			.number()
			.int("Room limit must be an integer")
			.min(1, "Room limit must be at least 1")
			.max(
				maxRoomListLimit,
				`Room limit cannot be greater than ${maxRoomListLimit}`
			)
			.default(defaultRoomListLimit)
	),
});
const roomConnectionArgsSchema = z.object({
	after: z.string().trim().min(1, "Room cursor cannot be empty").nullish(),
	first: z.preprocess(
		(value) => value ?? undefined,
		z
			.number()
			.int("Room page size must be an integer")
			.min(1, "Room page size must be at least 1")
			.max(
				maxRoomConnectionPageSize,
				`Room page size cannot be greater than ${maxRoomConnectionPageSize}`
			)
			.default(defaultRoomConnectionPageSize)
	),
});
const roomConnectionCursorSchema = z.object({
	createdAt: z.string().min(1),
	id: z.string().uuid(),
	name: z.string().min(1),
});
const plantConnectionArgsSchema = z.object({
	after: z.string().trim().min(1, "Plant cursor cannot be empty").nullish(),
	first: z.preprocess(
		(value) => value ?? undefined,
		z
			.number()
			.int("Plant page size must be an integer")
			.min(1, "Plant page size must be at least 1")
			.max(
				maxPlantConnectionPageSize,
				`Plant page size cannot be greater than ${maxPlantConnectionPageSize}`
			)
			.default(defaultPlantConnectionPageSize)
	),
});
const plantConnectionCursorSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
});

type RoomRecord = typeof room.$inferSelect;
type PlantRecord = typeof plant.$inferSelect;

interface RoomConnectionRecord extends RoomRecord {
	cursorCreatedAt: string;
}

interface RoomParent {
	id: string;
	plants?: PlantRecord[];
}

interface CreateRoomArgs {
	input: z.input<typeof createRoomInputSchema>;
}

interface UpdateRoomArgs {
	input: z.input<typeof updateRoomInputSchema>;
}

interface CreatePlantArgs {
	input: z.input<typeof createPlantInputSchema>;
}

interface UpdatePlantArgs {
	input: z.input<typeof updatePlantInputSchema>;
}

interface RoomArgs {
	id: string;
}

interface RoomsArgs {
	limit?: number | null;
}

interface RoomsConnectionArgs {
	after?: string | null;
	first?: number | null;
}

interface PlantCareNote {
	id: string;
	name: string;
	note: string;
	species: string;
}

interface PlantCareNoteArgs {
	id: string;
}

interface PlantsConnectionArgs {
	after?: string | null;
	first?: number | null;
}

interface RoomCarePlan {
	roomId: string;
	summary: string;
	tips: string[];
}

interface RoomPayload {
	room: RoomRecord;
	roomEdge: {
		cursor: string;
		node: RoomRecord;
	};
}

interface PlantPayload {
	plant: PlantRecord;
	plantEdge: {
		cursor: string;
		node: PlantRecord;
	};
	previousRoom: RoomRecord | null;
	room: RoomRecord;
}

export const typeDefs = gql`
  type Plant {
    id: ID!
    roomId: ID!
    name: String!
    species: String!
  }

  type PlantConnection {
    edges: [PlantEdge!]!
    pageInfo: PageInfo!
  }

  type PlantEdge {
    cursor: String!
    node: Plant!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }

  type RoomConnection {
    edges: [RoomEdge!]!
    pageInfo: PageInfo!
  }

  type RoomEdge {
    cursor: String!
    node: Room!
  }

  type Room {
    id: ID!
    name: String!
    description: String!
    plantCount: Int!
    plants: [Plant!]!
    plantsConnection(first: Int = 24, after: String): PlantConnection!
  }

  type RoomCarePlan {
    roomId: ID!
    summary: String!
    tips: [String!]!
  }

  type PlantCareNote {
    id: ID!
    name: String!
    species: String!
    note: String!
  }

  input CreateRoomInput {
    id: ID
    name: String!
    description: String!
  }

  input UpdateRoomInput {
    id: ID!
    name: String!
    description: String!
  }

  input CreatePlantInput {
    id: ID
    roomId: ID!
    name: String!
    species: String!
  }

  input UpdatePlantInput {
    id: ID!
    roomId: ID!
    name: String!
    species: String!
  }

  type CreateRoomPayload {
    room: Room!
    roomEdge: RoomEdge!
  }

  type UpdateRoomPayload {
    room: Room!
    roomEdge: RoomEdge!
  }

  type CreatePlantPayload {
    plant: Plant!
    plantEdge: PlantEdge!
    room: Room!
    previousRoom: Room
  }

  type UpdatePlantPayload {
    plant: Plant!
    plantEdge: PlantEdge!
    room: Room!
    previousRoom: Room
  }

  type Query {
    healthCheck: String!
    plantCareNote(id: ID!): PlantCareNote!
    room(id: ID!): Room
    roomCarePlan(id: ID!): RoomCarePlan!
    rooms(limit: Int = 8): [Room!]!
    roomsConnection(first: Int = 8, after: String): RoomConnection!
  }

  type Mutation {
    createRoom(input: CreateRoomInput!): CreateRoomPayload!
    updateRoom(input: UpdateRoomInput!): UpdateRoomPayload!
    createPlant(input: CreatePlantInput!): CreatePlantPayload!
    updatePlant(input: UpdatePlantInput!): UpdatePlantPayload!
  }
`;

const createBadUserInputError = (message: string) => {
	return new GraphQLError(message, {
		extensions: {
			code: "BAD_USER_INPUT",
		},
	});
};

const createNotFoundError = (resource: string) => {
	return new GraphQLError(`${resource} not found`, {
		extensions: {
			code: "NOT_FOUND",
		},
	});
};

const createDuplicateRoomNameError = (name: string) => {
	return createBadUserInputError(`A room named "${name}" already exists.`);
};

const isDatabaseError = (error: unknown): error is { code?: string } => {
	return typeof error === "object" && error !== null && "code" in error;
};

const throwDuplicateRoomNameIfNeeded = (
	error: unknown,
	name: string
): never => {
	if (isDatabaseError(error) && error.code === "23505") {
		throw createDuplicateRoomNameError(name);
	}

	throw error;
};

const getValidationMessage = (
	message: string | undefined,
	fallback: string
) => {
	return message?.trim() ? message : fallback;
};

const requireRecord = <TRecord>(
	record: TRecord | null | undefined,
	resource: string
) => {
	if (!record) {
		throw createNotFoundError(resource);
	}

	return record;
};

const getRooms = async (args: RoomsArgs) => {
	const parsedArgs = roomsArgsSchema.safeParse(args);

	if (!parsedArgs.success) {
		throw createBadUserInputError(
			getValidationMessage(
				parsedArgs.error.issues[0]?.message,
				"Invalid room list input"
			)
		);
	}

	return await db.query.room.findMany({
		limit: parsedArgs.data.limit,
		orderBy: (rooms, { desc }) => [desc(rooms.createdAt), desc(rooms.id)],
	});
};

const getRoomCreatedAtCursorValue = () => {
	return sql<string>`to_char(${room.createdAt}, 'YYYY-MM-DD"T"HH24:MI:SS.US')`;
};

const encodeRoomConnectionCursor = (roomRecord: RoomConnectionRecord) => {
	return Buffer.from(
		JSON.stringify({
			createdAt: roomRecord.cursorCreatedAt,
			id: roomRecord.id,
			name: roomRecord.name,
		})
	).toString("base64url");
};

const decodeRoomConnectionCursor = (cursor: string) => {
	try {
		const decodedCursor = JSON.parse(
			Buffer.from(cursor, "base64url").toString("utf8")
		);
		const parsedCursor = roomConnectionCursorSchema.safeParse(decodedCursor);

		if (!parsedCursor.success) {
			throw createBadUserInputError("Invalid room cursor");
		}

		return {
			createdAt: parsedCursor.data.createdAt,
			id: parsedCursor.data.id,
			name: parsedCursor.data.name,
		};
	} catch (error) {
		if (error instanceof GraphQLError) {
			throw error;
		}

		throw createBadUserInputError("Invalid room cursor");
	}
};

const getRoomsConnection = async (args: RoomsConnectionArgs) => {
	const parsedArgs = roomConnectionArgsSchema.safeParse(args);

	if (!parsedArgs.success) {
		throw createBadUserInputError(
			getValidationMessage(
				parsedArgs.error.issues[0]?.message,
				"Invalid room pagination input"
			)
		);
	}

	const afterCursor = parsedArgs.data.after
		? decodeRoomConnectionCursor(parsedArgs.data.after)
		: null;
	const createdAtCursorValue = getRoomCreatedAtCursorValue();
	const afterFilter = afterCursor
		? (() => {
				const afterCreatedAt = sql<Date>`${afterCursor.createdAt}::timestamp`;

				return or(
					lt(room.createdAt, afterCreatedAt),
					and(eq(room.createdAt, afterCreatedAt), lt(room.id, afterCursor.id))
				);
			})()
		: undefined;
	const roomRecords = await db
		.select({
			createdAt: room.createdAt,
			cursorCreatedAt: createdAtCursorValue,
			description: room.description,
			id: room.id,
			name: room.name,
		})
		.from(room)
		.where(afterFilter)
		.orderBy(desc(room.createdAt), desc(room.id))
		.limit(parsedArgs.data.first + 1);
	const visibleRoomRecords = roomRecords.slice(0, parsedArgs.data.first);
	const lastRoomRecord =
		visibleRoomRecords.length > 0 ? visibleRoomRecords.at(-1) : undefined;

	return {
		edges: visibleRoomRecords.map((roomRecord) => {
			return {
				cursor: encodeRoomConnectionCursor(roomRecord),
				node: roomRecord,
			};
		}),
		pageInfo: {
			endCursor: lastRoomRecord
				? encodeRoomConnectionCursor(lastRoomRecord)
				: null,
			hasNextPage: roomRecords.length > parsedArgs.data.first,
		},
	};
};

const getRoomById = async (id: string) => {
	return await db.query.room.findFirst({
		where: (rooms, { eq }) => eq(rooms.id, id),
	});
};

const getRoomConnectionRecordById = async (id: string) => {
	const createdAtCursorValue = getRoomCreatedAtCursorValue();
	const [roomRecord] = await db
		.select({
			createdAt: room.createdAt,
			cursorCreatedAt: createdAtCursorValue,
			description: room.description,
			id: room.id,
			name: room.name,
		})
		.from(room)
		.where(eq(room.id, id))
		.limit(1);

	return roomRecord;
};

const getRoomEdge = async (id: string) => {
	const roomRecord = requireRecord(
		await getRoomConnectionRecordById(id),
		"Room"
	);

	return {
		cursor: encodeRoomConnectionCursor(roomRecord),
		node: roomRecord,
	};
};

const getRoomByName = async (name: string, excludedRoomId?: string) => {
	const duplicateFilter = excludedRoomId
		? and(eq(room.name, name), ne(room.id, excludedRoomId))
		: eq(room.name, name);

	return await db.query.room.findFirst({
		where: duplicateFilter,
	});
};

const ensureRoomNameAvailable = async (
	name: string,
	excludedRoomId?: string
) => {
	const duplicateRoom = await getRoomByName(name, excludedRoomId);

	if (duplicateRoom) {
		throw createDuplicateRoomNameError(name);
	}
};

const getPlantById = async (id: string) => {
	return await db.query.plant.findFirst({
		where: (plants, { eq }) => eq(plants.id, id),
	});
};

const getPlantsByRoomId = async (roomId: string) => {
	return await db.query.plant.findMany({
		orderBy: (plants, { asc }) => [asc(plants.name), asc(plants.id)],
		where: (plants, { eq }) => eq(plants.roomId, roomId),
	});
};

const getRoomPlantCount = async (roomId: string) => {
	const [plantCountRecord] = await db
		.select({
			value: count(),
		})
		.from(plant)
		.where(eq(plant.roomId, roomId));

	return plantCountRecord?.value ?? 0;
};

const getPlantCountLabel = (plantCount: number) => {
	return `${plantCount} plant${plantCount === 1 ? "" : "s"}`;
};

const createRoomCareTips = (plantCount: number) => {
	if (plantCount === 0) {
		return [
			"Add one plant before creating a care routine.",
			"Choose a spot with steady light and easy watering access.",
		];
	}

	return [
		"Check light and soil moisture before watering.",
		"Group plants with similar watering needs together.",
		"Rotate plants every few weeks so growth stays even.",
	];
};

const encodePlantConnectionCursor = (plantRecord: PlantRecord) => {
	return Buffer.from(
		JSON.stringify({
			id: plantRecord.id,
			name: plantRecord.name,
		})
	).toString("base64url");
};

const decodePlantConnectionCursor = (cursor: string) => {
	try {
		const decodedCursor = JSON.parse(
			Buffer.from(cursor, "base64url").toString("utf8")
		);
		const parsedCursor = plantConnectionCursorSchema.safeParse(decodedCursor);

		if (!parsedCursor.success) {
			throw createBadUserInputError("Invalid plant cursor");
		}

		return parsedCursor.data;
	} catch (error) {
		if (error instanceof GraphQLError) {
			throw error;
		}

		throw createBadUserInputError("Invalid plant cursor");
	}
};

const getPlantConnection = async (
	roomId: string,
	args: PlantsConnectionArgs
) => {
	const parsedArgs = plantConnectionArgsSchema.safeParse(args);

	if (!parsedArgs.success) {
		throw createBadUserInputError(
			getValidationMessage(
				parsedArgs.error.issues[0]?.message,
				"Invalid plant pagination input"
			)
		);
	}

	const afterCursor = parsedArgs.data.after
		? decodePlantConnectionCursor(parsedArgs.data.after)
		: null;
	const afterFilter = afterCursor
		? or(
				gt(plant.name, afterCursor.name),
				and(eq(plant.name, afterCursor.name), gt(plant.id, afterCursor.id))
			)
		: undefined;
	const whereClause = afterFilter
		? and(eq(plant.roomId, roomId), afterFilter)
		: eq(plant.roomId, roomId);
	const plantRecords = await db
		.select()
		.from(plant)
		.where(whereClause)
		.orderBy(asc(plant.name), asc(plant.id))
		.limit(parsedArgs.data.first + 1);
	const visiblePlantRecords = plantRecords.slice(0, parsedArgs.data.first);
	const lastPlantRecord =
		visiblePlantRecords.length > 0 ? visiblePlantRecords.at(-1) : undefined;

	return {
		edges: visiblePlantRecords.map((plantRecord) => {
			return {
				cursor: encodePlantConnectionCursor(plantRecord),
				node: plantRecord,
			};
		}),
		pageInfo: {
			endCursor: lastPlantRecord
				? encodePlantConnectionCursor(lastPlantRecord)
				: null,
			hasNextPage: plantRecords.length > parsedArgs.data.first,
		},
	};
};

export const resolvers = {
	Mutation: {
		createPlant: async (
			_parent: unknown,
			args: CreatePlantArgs
		): Promise<PlantPayload> => {
			const parsedArgs = createPlantInputSchema.safeParse(args.input);

			if (!parsedArgs.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedArgs.error.issues[0]?.message,
						"Invalid plant input"
					)
				);
			}

			const targetRoom = requireRecord(
				await getRoomById(parsedArgs.data.roomId),
				"Room"
			);
			const [createdPlant] = await db
				.insert(plant)
				.values({
					...(parsedArgs.data.id ? { id: parsedArgs.data.id } : {}),
					name: parsedArgs.data.name,
					roomId: targetRoom.id,
					species: parsedArgs.data.species,
				})
				.returning();
			const plantRecord = requireRecord(createdPlant, "Plant");

			return {
				plant: plantRecord,
				plantEdge: {
					cursor: encodePlantConnectionCursor(plantRecord),
					node: plantRecord,
				},
				previousRoom: null,
				room: targetRoom,
			};
		},
		createRoom: async (
			_parent: unknown,
			args: CreateRoomArgs
		): Promise<RoomPayload> => {
			const parsedArgs = createRoomInputSchema.safeParse(args.input);

			if (!parsedArgs.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedArgs.error.issues[0]?.message,
						"Invalid room input"
					)
				);
			}

			await ensureRoomNameAvailable(parsedArgs.data.name);

			try {
				const [createdRoom] = await db
					.insert(room)
					.values({
						...(parsedArgs.data.id ? { id: parsedArgs.data.id } : {}),
						description: parsedArgs.data.description,
						name: parsedArgs.data.name,
					})
					.returning();
				const roomRecord = requireRecord(createdRoom, "Room");

				return {
					room: roomRecord,
					roomEdge: await getRoomEdge(roomRecord.id),
				};
			} catch (error) {
				return throwDuplicateRoomNameIfNeeded(error, parsedArgs.data.name);
			}
		},
		updatePlant: async (
			_parent: unknown,
			args: UpdatePlantArgs
		): Promise<PlantPayload> => {
			const parsedArgs = updatePlantInputSchema.safeParse(args.input);

			if (!parsedArgs.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedArgs.error.issues[0]?.message,
						"Invalid plant input"
					)
				);
			}

			const existingPlant = requireRecord(
				await getPlantById(parsedArgs.data.id),
				"Plant"
			);
			const targetRoom = requireRecord(
				await getRoomById(parsedArgs.data.roomId),
				"Room"
			);
			const previousRoom =
				existingPlant.roomId === targetRoom.id
					? null
					: requireRecord(await getRoomById(existingPlant.roomId), "Room");
			const [updatedPlant] = await db
				.update(plant)
				.set({
					name: parsedArgs.data.name,
					roomId: targetRoom.id,
					species: parsedArgs.data.species,
				})
				.where(eq(plant.id, parsedArgs.data.id))
				.returning();
			const plantRecord = requireRecord(updatedPlant, "Plant");

			return {
				plant: plantRecord,
				plantEdge: {
					cursor: encodePlantConnectionCursor(plantRecord),
					node: plantRecord,
				},
				previousRoom,
				room: targetRoom,
			};
		},
		updateRoom: async (
			_parent: unknown,
			args: UpdateRoomArgs
		): Promise<RoomPayload> => {
			const parsedArgs = updateRoomInputSchema.safeParse(args.input);

			if (!parsedArgs.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedArgs.error.issues[0]?.message,
						"Invalid room input"
					)
				);
			}

			requireRecord(await getRoomById(parsedArgs.data.id), "Room");
			await ensureRoomNameAvailable(parsedArgs.data.name, parsedArgs.data.id);

			try {
				const [updatedRoom] = await db
					.update(room)
					.set({
						description: parsedArgs.data.description,
						name: parsedArgs.data.name,
					})
					.where(eq(room.id, parsedArgs.data.id))
					.returning();
				const roomRecord = requireRecord(updatedRoom, "Room");

				return {
					room: roomRecord,
					roomEdge: await getRoomEdge(roomRecord.id),
				};
			} catch (error) {
				return throwDuplicateRoomNameIfNeeded(error, parsedArgs.data.name);
			}
		},
	},
	Query: {
		healthCheck: () => {
			return "OK";
		},
		plantCareNote: async (
			_parent: unknown,
			args: PlantCareNoteArgs
		): Promise<PlantCareNote> => {
			const parsedId = plantIdSchema.safeParse(args.id);

			if (!parsedId.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedId.error.issues[0]?.message,
						"Plant id must be a valid UUID"
					)
				);
			}

			const plantRecord = requireRecord(
				await getPlantById(parsedId.data),
				"Plant"
			);

			return {
				id: plantRecord.id,
				name: plantRecord.name,
				note: `Keep ${plantRecord.name} on a steady care rhythm for ${plantRecord.species}.`,
				species: plantRecord.species,
			};
		},
		room: async (_parent: unknown, args: RoomArgs) => {
			const parsedId = roomIdSchema.safeParse(args.id);

			if (!parsedId.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedId.error.issues[0]?.message,
						"Room id must be a valid UUID"
					)
				);
			}

			return await getRoomById(parsedId.data);
		},
		roomCarePlan: async (
			_parent: unknown,
			args: RoomArgs
		): Promise<RoomCarePlan> => {
			const parsedId = roomIdSchema.safeParse(args.id);

			if (!parsedId.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedId.error.issues[0]?.message,
						"Room id must be a valid UUID"
					)
				);
			}

			const roomRecord = requireRecord(
				await getRoomById(parsedId.data),
				"Room"
			);
			const plantCount = await getRoomPlantCount(roomRecord.id);

			return {
				roomId: roomRecord.id,
				summary: `${roomRecord.name} has ${getPlantCountLabel(plantCount)} to keep on schedule.`,
				tips: createRoomCareTips(plantCount),
			};
		},
		rooms: async (_parent: unknown, args: RoomsArgs) => {
			return await getRooms(args);
		},
		roomsConnection: async (_parent: unknown, args: RoomsConnectionArgs) => {
			return await getRoomsConnection(args);
		},
	},
	Room: {
		plantCount: async (roomRecord: RoomParent) => {
			return (
				roomRecord.plants?.length ?? (await getRoomPlantCount(roomRecord.id))
			);
		},
		plants: async (roomRecord: RoomParent) => {
			return roomRecord.plants ?? (await getPlantsByRoomId(roomRecord.id));
		},
		plantsConnection: async (
			roomRecord: RoomParent,
			args: PlantsConnectionArgs
		) => {
			return await getPlantConnection(roomRecord.id, args);
		},
	},
};
