import { useMutation, useQuery } from "@apollo/client/react";
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
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { type SubmitEvent, useState } from "react";

import { graphql } from "@/__gql__";
import type { TodosRouteQueryQuery } from "@/__gql__/graphql";

export const Route = createFileRoute("/todos")({
	component: TodosRoute,
});

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

interface TodoListContentProps {
	errorMessage: null | string;
	isDeleting: boolean;
	isLoading: boolean;
	isToggling: boolean;
	onDelete: (id: number) => void;
	onToggle: (id: number, completed: boolean) => void;
	todos: TodosRouteQueryQuery["todos"];
}

function TodoListContent({
	errorMessage,
	isDeleting,
	isLoading,
	isToggling,
	onDelete,
	onToggle,
	todos,
}: TodoListContentProps) {
	if (isLoading) {
		return (
			<div className="flex justify-center py-4">
				<Loader2 className="h-6 w-6 animate-spin" />
			</div>
		);
	}

	if (errorMessage) {
		return <p className="py-4 text-center text-red-500">{errorMessage}</p>;
	}

	if (todos.length === 0) {
		return <p className="py-4 text-center">No todos yet. Add one above!</p>;
	}

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

function TodosRoute() {
	const [newTodoText, setNewTodoText] = useState("");

	const { data, error, loading } = useQuery(TodosRouteQuery);
	const todoItems = data?.todos ?? [];
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

				const existingTodos = cache.readQuery({
					query: TodosRouteQuery,
				});

				const todos = existingTodos?.todos ?? [];
				const nextTodos = todos.some((todo) => todo.id === createdTodo.id)
					? todos
					: [...todos, createdTodo];

				cache.writeQuery({
					data: {
						__typename: "Query",
						todos: nextTodos,
					},
					query: TodosRouteQuery,
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

				const existingTodos = cache.readQuery({
					query: TodosRouteQuery,
				});

				if (existingTodos) {
					cache.writeQuery({
						data: {
							__typename: "Query",
							todos: existingTodos.todos.filter(
								(todo) => todo.id !== deletedTodoId
							),
						},
						query: TodosRouteQuery,
					});
				}

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

					<TodoListContent
						errorMessage={error?.message ?? null}
						isDeleting={isDeleting}
						isLoading={loading}
						isToggling={isToggling}
						onDelete={handleDeleteTodo}
						onToggle={handleToggleTodo}
						todos={todoItems}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
