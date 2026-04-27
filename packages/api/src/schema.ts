import { db } from "@graphql-conf/db";
import { todo } from "@graphql-conf/db/schema/todo";
import { eq } from "drizzle-orm";
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
const plantIdSchema = z.string().uuid("Plant id must be a valid UUID");
const roomIdSchema = z.string().uuid("Room id must be a valid UUID");

type TodoRecord = typeof todo.$inferSelect;

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

interface PlantCareNote {
	id: string;
	name: string;
	note: string;
	species: string;
}

interface PlantCareNoteArgs {
	id: string;
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

  type Room {
    id: ID!
    name: String!
    description: String!
    plantCount: Int!
    plants: [Plant!]!
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
    rooms: [Room!]!
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

const getRooms = async () => {
	return await db.query.room.findMany({
		orderBy: (rooms, { asc }) => [asc(rooms.name)],
		with: {
			plants: {
				orderBy: (plants, { asc }) => [asc(plants.name)],
			},
		},
	});
};

const getRoomById = async (id: string) => {
	return await db.query.room.findFirst({
		where: (rooms, { eq }) => eq(rooms.id, id),
		with: {
			plants: {
				orderBy: (plants, { asc }) => [asc(plants.name)],
			},
		},
	});
};

const getPlantById = async (id: string) => {
	return await db.query.plant.findFirst({
		where: (plants, { eq }) => eq(plants.id, id),
	});
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
			const plantCount = roomRecord.plants.length;

			return {
				roomId: roomRecord.id,
				summary: `${roomRecord.name} has ${getPlantCountLabel(plantCount)} to keep on schedule.`,
				tips: createRoomCareTips(plantCount),
			};
		},
		rooms: async () => {
			return await getRooms();
		},
		todos: async (): Promise<TodoRecord[]> => {
			return await db.select().from(todo);
		},
	},
	Room: {
		plantCount: (roomRecord: { plants?: unknown[] }) => {
			return roomRecord.plants?.length ?? 0;
		},
	},
};
