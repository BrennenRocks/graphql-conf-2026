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

  type Query {
    healthCheck: String!
    privateData: PrivateData!
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
		todos: async (): Promise<TodoRecord[]> => {
			return await db.select().from(todo);
		},
	},
};
