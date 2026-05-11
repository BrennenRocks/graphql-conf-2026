import { Buffer } from "node:buffer";

import { db } from "@graphql-conf/db";
import { plant, room } from "@graphql-conf/db/schema/rooms";
import { todo } from "@graphql-conf/db/schema/todo";
import { and, asc, count, eq, gt, or } from "drizzle-orm";
import { GraphQLError } from "graphql";
import gql from "graphql-tag";
import z from "zod";

import type { Context } from "./context";

const createTodoSchema = z.string().trim().min(1, "Todo text is required");

const toggleTodoSchema = z.object({
	completed: z.boolean(),
	id: z.number().int(),
});

const deleteTodoSchema = z.number().int();
const defaultRoomListLimit = 8;
const maxRoomListLimit = 50;
const defaultRoomConnectionPageSize = 8;
const maxRoomConnectionPageSize = 50;
const defaultPlantConnectionPageSize = 24;
const maxPlantConnectionPageSize = 50;
const plantIdSchema = z.string().uuid("Plant id must be a valid UUID");
const roomIdSchema = z.string().uuid("Room id must be a valid UUID");
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

type TodoRecord = typeof todo.$inferSelect;
type RoomRecord = typeof room.$inferSelect;
type PlantRecord = typeof plant.$inferSelect;

interface RoomParent {
	id: string;
	plants?: PlantRecord[];
}

interface PrivateData {
	message: string;
	user: {
		email: string;
		id: string;
		name: string;
	};
}

interface TodoMutationArgs {
	completed: boolean;
	id: number;
}

interface DeleteTodoArgs {
	id: number;
}

interface CreateTodoArgs {
	text: string;
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

export const typeDefs = gql`
  type Todo {
    id: Int!
    text: String!
    completed: Boolean!
  }

  type Viewer {
    id: ID!
    name: String!
    email: String!
  }

  type PrivateData {
    message: String!
    user: Viewer!
  }

  type Plant {
    id: ID!
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

  type Query {
    healthCheck: String!
    plantCareNote(id: ID!): PlantCareNote!
    privateData: PrivateData!
    room(id: ID!): Room
    roomCarePlan(id: ID!): RoomCarePlan!
    rooms(limit: Int = 8): [Room!]!
    roomsConnection(first: Int = 8, after: String): RoomConnection!
    todos: [Todo!]!
  }

  type Mutation {
    createTodo(text: String!): Todo!
    toggleTodo(id: Int!, completed: Boolean!): Todo!
    deleteTodo(id: Int!): Int!
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

const getValidationMessage = (
	message: string | undefined,
	fallback: string
) => {
	return message?.trim() ? message : fallback;
};

const requireSession = (context: Context) => {
	if (!context.session) {
		throw new GraphQLError("Authentication required", {
			extensions: {
				code: "UNAUTHENTICATED",
			},
		});
	}

	return context.session;
};

const requireTodo = (todoRecord: TodoRecord | undefined) => {
	if (!todoRecord) {
		throw createNotFoundError("Todo");
	}

	return todoRecord;
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
		orderBy: (rooms, { asc }) => [asc(rooms.name)],
	});
};

const encodeRoomConnectionCursor = (roomRecord: RoomRecord) => {
	return Buffer.from(
		JSON.stringify({
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

		return parsedCursor.data;
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
	const afterFilter = afterCursor
		? or(
				gt(room.name, afterCursor.name),
				and(eq(room.name, afterCursor.name), gt(room.id, afterCursor.id))
			)
		: undefined;
	const roomRecords = await db
		.select()
		.from(room)
		.where(afterFilter)
		.orderBy(asc(room.name), asc(room.id))
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
		createTodo: async (
			_parent: unknown,
			args: CreateTodoArgs
		): Promise<TodoRecord> => {
			const parsedText = createTodoSchema.safeParse(args.text);

			if (!parsedText.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedText.error.issues[0]?.message,
						"Todo text is required"
					)
				);
			}

			const [createdTodo] = await db
				.insert(todo)
				.values({
					text: parsedText.data,
				})
				.returning();

			return requireTodo(createdTodo);
		},
		deleteTodo: async (
			_parent: unknown,
			args: DeleteTodoArgs
		): Promise<number> => {
			const parsedId = deleteTodoSchema.safeParse(args.id);

			if (!parsedId.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedId.error.issues[0]?.message,
						"Invalid todo id"
					)
				);
			}

			const [deletedTodo] = await db
				.delete(todo)
				.where(eq(todo.id, parsedId.data))
				.returning({ id: todo.id });

			if (!deletedTodo) {
				throw createNotFoundError("Todo");
			}

			return deletedTodo.id;
		},
		toggleTodo: async (
			_parent: unknown,
			args: TodoMutationArgs
		): Promise<TodoRecord> => {
			const parsedArgs = toggleTodoSchema.safeParse(args);

			if (!parsedArgs.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedArgs.error.issues[0]?.message,
						"Invalid todo input"
					)
				);
			}

			const [updatedTodo] = await db
				.update(todo)
				.set({
					completed: parsedArgs.data.completed,
				})
				.where(eq(todo.id, parsedArgs.data.id))
				.returning();

			return requireTodo(updatedTodo);
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
		privateData: (
			_parent: unknown,
			_args: unknown,
			context: Context
		): PrivateData => {
			const session = requireSession(context);

			return {
				message: "This is private",
				user: {
					email: session.user.email,
					id: session.user.id,
					name: session.user.name,
				},
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
		todos: async (): Promise<TodoRecord[]> => {
			return await db.select().from(todo);
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
