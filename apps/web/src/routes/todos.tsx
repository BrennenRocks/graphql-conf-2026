import { type QueryRef, useMutation, useReadQuery } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Checkbox } from "@graphql-conf/ui/components/checkbox";
import { Input } from "@graphql-conf/ui/components/input";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { type SubmitEvent, Suspense, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import type { DocumentType } from "@/__gql__";
import { graphql } from "@/__gql__";
import type { TodosRouteQueryQuery } from "@/__gql__/graphql";
import { ErrorState } from "@/components/shared/error-state";
import { preloadQuery } from "@/lib/apollo-client";

const TodosRouteQuery = graphql(/* GraphQL */ `
  query TodosRouteQuery {
    todos {
      completed
      id
      text
    }
  }
`);

const CreateTodoMutation = graphql(/* GraphQL */ `
  mutation CreateTodoMutation($text: String!) {
    createTodo(text: $text) {
      completed
      id
      text
    }
  }
`);

const ToggleTodoMutation = graphql(/* GraphQL */ `
  mutation ToggleTodoMutation($completed: Boolean!, $id: Int!) {
    toggleTodo(completed: $completed, id: $id) {
      completed
      id
      text
    }
  }
`);

const DeleteTodoMutation = graphql(/* GraphQL */ `
  mutation DeleteTodoMutation($id: Int!) {
    deleteTodo(id: $id)
  }
`);

type TodosQueryRef = QueryRef<DocumentType<typeof TodosRouteQuery>>;

const TODO_LIST_SKELETON_IDS = [
	"todo-skeleton-alpha",
	"todo-skeleton-bravo",
	"todo-skeleton-charlie",
] as const;

export const Route = createFileRoute("/todos")({
	component: TodosRoute,
	loader: () => {
		return {
			queryRef: preloadQuery(TodosRouteQuery),
		};
	},
});

function TodosRoute() {
	const { queryRef } = Route.useLoaderData();
	const [newTodoText, setNewTodoText] = useState("");

	const [createTodo, { loading: isCreating }] = useMutation(
		CreateTodoMutation,
		{
			onCompleted: () => {
				setNewTodoText("");
			},
			update(cache, { data: mutationData }) {
				const createdTodo = mutationData?.createTodo;

				if (!createdTodo) {
					return;
				}

				cache.modify({
					fields: {
						todos(
							existing: ReadonlyArray<{ __ref: string }> | undefined,
							{ readField, toReference }
						) {
							const newTodoRef = toReference(createdTodo);
							const list = existing ?? [];

							if (!newTodoRef) {
								return list;
							}

							const alreadyPresent = list.some((todoRef) => {
								return readField("id", todoRef) === createdTodo.id;
							});

							return alreadyPresent ? list : [...list, newTodoRef];
						},
					},
				});
			},
		}
	);
	const [toggleTodo, { loading: isToggling }] = useMutation(ToggleTodoMutation);
	const [deleteTodo, { loading: isDeleting }] = useMutation(
		DeleteTodoMutation,
		{
			update(cache, { data: mutationData }) {
				const deletedTodoId = mutationData?.deleteTodo;

				if (deletedTodoId == null) {
					return;
				}

				cache.modify({
					fields: {
						todos(
							existing: ReadonlyArray<{ __ref: string }> | undefined,
							{ readField }
						) {
							const list = existing ?? [];

							return list.filter((todoRef) => {
								return readField("id", todoRef) !== deletedTodoId;
							});
						},
					},
				});

				cache.evict({
					id: cache.identify({
						__typename: "Todo",
						id: deletedTodoId,
					}),
				});
				cache.gc();
			},
		}
	);

	const handleAddTodo = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmedTodoText = newTodoText.trim();

		if (trimmedTodoText) {
			createTodo({
				variables: {
					text: trimmedTodoText,
				},
			}).catch(() => undefined);
		}
	};

	const handleToggleTodo = (id: number, completed: boolean) => {
		toggleTodo({
			variables: {
				completed: !completed,
				id,
			},
		}).catch(() => undefined);
	};

	const handleDeleteTodo = (id: number) => {
		deleteTodo({
			variables: {
				id,
			},
		}).catch(() => undefined);
	};

	return (
		<div className="mx-auto w-full max-w-md py-10">
			<Card>
				<CardHeader>
					<CardTitle>Todo List</CardTitle>
					<CardDescription>Manage your tasks efficiently</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="mb-6 flex items-center space-x-2"
						onSubmit={handleAddTodo}
					>
						<Input
							disabled={isCreating}
							onChange={(e) => setNewTodoText(e.target.value)}
							placeholder="Add a new task..."
							value={newTodoText}
						/>
						<Button disabled={isCreating || !newTodoText.trim()} type="submit">
							{isCreating ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Add"
							)}
						</Button>
					</form>

					<ErrorBoundary FallbackComponent={TodoListError}>
						<Suspense fallback={<TodoListSkeleton />}>
							<TodoList
								isDeleting={isDeleting}
								isToggling={isToggling}
								onDelete={handleDeleteTodo}
								onToggle={handleToggleTodo}
								queryRef={queryRef}
							/>
						</Suspense>
					</ErrorBoundary>
				</CardContent>
			</Card>
		</div>
	);
}

interface TodoListProps {
	isDeleting: boolean;
	isToggling: boolean;
	onDelete: (id: number) => void;
	onToggle: (id: number, completed: boolean) => void;
	queryRef: TodosQueryRef;
}

function TodoList({
	isDeleting,
	isToggling,
	onDelete,
	onToggle,
	queryRef,
}: TodoListProps) {
	const { data } = useReadQuery(queryRef);
	const todos = data.todos;

	if (todos.length === 0) {
		return <p className="py-4 text-center">No todos yet. Add one above!</p>;
	}

	return (
		<TodoListContent
			isDeleting={isDeleting}
			isToggling={isToggling}
			onDelete={onDelete}
			onToggle={onToggle}
			todos={todos}
		/>
	);
}

interface TodoListContentProps {
	isDeleting: boolean;
	isToggling: boolean;
	onDelete: (id: number) => void;
	onToggle: (id: number, completed: boolean) => void;
	todos: TodosRouteQueryQuery["todos"];
}

function TodoListContent({
	isDeleting,
	isToggling,
	onDelete,
	onToggle,
	todos,
}: TodoListContentProps) {
	return (
		<ul className="space-y-2">
			{todos.map((todo) => (
				<li
					className="flex items-center justify-between rounded-md border p-2"
					key={todo.id}
				>
					<div className="flex items-center space-x-2">
						<Checkbox
							checked={todo.completed}
							disabled={isDeleting || isToggling}
							id={`todo-${todo.id}`}
							onCheckedChange={() => onToggle(todo.id, todo.completed)}
						/>
						<label
							className={`${todo.completed ? "line-through" : ""}`}
							htmlFor={`todo-${todo.id}`}
						>
							{todo.text}
						</label>
					</div>
					<Button
						aria-label="Delete todo"
						disabled={isDeleting || isToggling}
						onClick={() => onDelete(todo.id)}
						size="icon"
						variant="ghost"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</li>
			))}
		</ul>
	);
}

function TodoListSkeleton() {
	return (
		<ul className="space-y-2">
			{TODO_LIST_SKELETON_IDS.map((skeletonId) => {
				return (
					<li
						className="flex items-center justify-between rounded-md border p-2"
						key={skeletonId}
					>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-4 w-4 rounded-sm" />
							<Skeleton className="h-4 w-40" />
						</div>
						<Skeleton className="h-8 w-8 rounded-md" />
					</li>
				);
			})}
		</ul>
	);
}

function TodoListError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="Failed to load todos"
		/>
	);
}
