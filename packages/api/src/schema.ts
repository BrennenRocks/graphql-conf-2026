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
const missionIdSchema = z.string().uuid("Mission id must be a valid UUID");

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

interface MissionArgs {
	id: string;
}

export const typeDefs = gql`
  enum CrewRole {
    HACKER
    PILOT
    MUSCLE
    GRIFTER
    ENGINEER
  }

  enum MissionStatus {
    PLANNING
    READY
    COMMITTED
  }

  enum ToolCategory {
    INFILTRATION
    SURVEILLANCE
    SOCIAL
    DEMOLITION
    ESCAPE
  }

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

  type Faction {
    id: ID!
    name: String!
    description: String!
  }

  type Ship {
    id: ID!
    name: String!
    shipClass: String!
    stealthRating: Int!
    cargoSlots: Int!
  }

  type CrewMember {
    id: ID!
    name: String!
    callSign: String!
    role: CrewRole!
    bio: String!
    active: Boolean!
  }

  type Tool {
    id: ID!
    name: String!
    category: ToolCategory!
    description: String!
  }

  type MissionCrewAssignment {
    assignmentOrder: Int!
    crewMember: CrewMember!
  }

  type MissionToolAssignment {
    quantity: Int!
    tool: Tool!
  }

  type Mission {
    id: ID!
    codeName: String!
    targetName: String!
    destination: String!
    summary: String!
    payout: Int!
    riskLevel: Int!
    status: MissionStatus!
    faction: Faction!
    ship: Ship
    crewAssignments: [MissionCrewAssignment!]!
    toolAssignments: [MissionToolAssignment!]!
  }

  type Query {
    healthCheck: String!
    privateData: PrivateData!
    factions: [Faction!]!
    crewMembers: [CrewMember!]!
    mission(id: ID!): Mission
    missions: [Mission!]!
    ships: [Ship!]!
    tools: [Tool!]!
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

const getMissions = async () => {
	return await db.query.mission.findMany({
		orderBy: (missions, { asc }) => [asc(missions.codeName)],
		with: {
			crewAssignments: {
				orderBy: (crewAssignments, { asc }) => [
					asc(crewAssignments.assignmentOrder),
				],
				with: {
					crewMember: true,
				},
			},
			faction: true,
			ship: true,
			toolAssignments: {
				with: {
					tool: true,
				},
			},
		},
	});
};

const getMissionById = async (id: string) => {
	return await db.query.mission.findFirst({
		where: (missions, { eq }) => eq(missions.id, id),
		with: {
			crewAssignments: {
				orderBy: (crewAssignments, { asc }) => [
					asc(crewAssignments.assignmentOrder),
				],
				with: {
					crewMember: true,
				},
			},
			faction: true,
			ship: true,
			toolAssignments: {
				with: {
					tool: true,
				},
			},
		},
	});
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
		factions: async () => {
			return await db.query.faction.findMany({
				orderBy: (factions, { asc }) => [asc(factions.name)],
			});
		},
		crewMembers: async () => {
			return await db.query.crewMember.findMany({
				orderBy: (crewMembers, { asc }) => [asc(crewMembers.name)],
			});
		},
		healthCheck: () => {
			return "OK";
		},
		mission: async (_parent: unknown, args: MissionArgs) => {
			const parsedId = missionIdSchema.safeParse(args.id);

			if (!parsedId.success) {
				throw createBadUserInputError(
					getValidationMessage(
						parsedId.error.issues[0]?.message,
						"Mission id must be a valid UUID"
					)
				);
			}

			return await getMissionById(parsedId.data);
		},
		missions: async () => {
			return await getMissions();
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
		ships: async () => {
			return await db.query.ship.findMany({
				orderBy: (ships, { asc }) => [asc(ships.name)],
			});
		},
		tools: async () => {
			return await db.query.tool.findMany({
				orderBy: (tools, { asc }) => [asc(tools.name)],
			});
		},
		todos: async (): Promise<TodoRecord[]> => {
			return await db.select().from(todo);
		},
	},
};
