/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\tname\n\t\tspecies\n\t}\n": typeof types.PlantListItem_PlantFragmentDoc,
    "\n\tfragment RoomHeader_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": typeof types.RoomHeader_RoomFragmentDoc,
    "\n\tfragment RoomListItem_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": typeof types.RoomListItem_RoomFragmentDoc,
    "\n\tfragment RoomPlantList_room on Room {\n\t\tid\n\t\tplants {\n\t\t\tid\n\t\t\t...PlantListItem_plant\n\t\t}\n\t}\n": typeof types.RoomPlantList_RoomFragmentDoc,
    "\n\tquery RoomsPlannerLayoutQuery {\n\t\trooms {\n\t\t\tid\n\t\t\t...RoomListItem_room\n\t\t\t...RoomHeader_room\n\t\t\t...RoomPlantList_room\n\t\t}\n\t}\n": typeof types.RoomsPlannerLayoutQueryDocument,
    "\n  query DashboardRouteQuery {\n    privateData {\n      message\n      user {\n        email\n        id\n        name\n      }\n    }\n  }\n": typeof types.DashboardRouteQueryDocument,
    "\n  query HomeRouteQuery {\n    healthCheck\n  }\n": typeof types.HomeRouteQueryDocument,
    "\n  query TodosRouteQuery {\n    todos {\n      completed\n      id\n      text\n    }\n  }\n": typeof types.TodosRouteQueryDocument,
    "\n  mutation CreateTodoMutation($text: String!) {\n    createTodo(text: $text) {\n      completed\n      id\n      text\n    }\n  }\n": typeof types.CreateTodoMutationDocument,
    "\n  mutation ToggleTodoMutation($completed: Boolean!, $id: Int!) {\n    toggleTodo(completed: $completed, id: $id) {\n      completed\n      id\n      text\n    }\n  }\n": typeof types.ToggleTodoMutationDocument,
    "\n  mutation DeleteTodoMutation($id: Int!) {\n    deleteTodo(id: $id)\n  }\n": typeof types.DeleteTodoMutationDocument,
};
const documents: Documents = {
    "\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\tname\n\t\tspecies\n\t}\n": types.PlantListItem_PlantFragmentDoc,
    "\n\tfragment RoomHeader_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": types.RoomHeader_RoomFragmentDoc,
    "\n\tfragment RoomListItem_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": types.RoomListItem_RoomFragmentDoc,
    "\n\tfragment RoomPlantList_room on Room {\n\t\tid\n\t\tplants {\n\t\t\tid\n\t\t\t...PlantListItem_plant\n\t\t}\n\t}\n": types.RoomPlantList_RoomFragmentDoc,
    "\n\tquery RoomsPlannerLayoutQuery {\n\t\trooms {\n\t\t\tid\n\t\t\t...RoomListItem_room\n\t\t\t...RoomHeader_room\n\t\t\t...RoomPlantList_room\n\t\t}\n\t}\n": types.RoomsPlannerLayoutQueryDocument,
    "\n  query DashboardRouteQuery {\n    privateData {\n      message\n      user {\n        email\n        id\n        name\n      }\n    }\n  }\n": types.DashboardRouteQueryDocument,
    "\n  query HomeRouteQuery {\n    healthCheck\n  }\n": types.HomeRouteQueryDocument,
    "\n  query TodosRouteQuery {\n    todos {\n      completed\n      id\n      text\n    }\n  }\n": types.TodosRouteQueryDocument,
    "\n  mutation CreateTodoMutation($text: String!) {\n    createTodo(text: $text) {\n      completed\n      id\n      text\n    }\n  }\n": types.CreateTodoMutationDocument,
    "\n  mutation ToggleTodoMutation($completed: Boolean!, $id: Int!) {\n    toggleTodo(completed: $completed, id: $id) {\n      completed\n      id\n      text\n    }\n  }\n": types.ToggleTodoMutationDocument,
    "\n  mutation DeleteTodoMutation($id: Int!) {\n    deleteTodo(id: $id)\n  }\n": types.DeleteTodoMutationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\tname\n\t\tspecies\n\t}\n"): (typeof documents)["\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\tname\n\t\tspecies\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment RoomHeader_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n"): (typeof documents)["\n\tfragment RoomHeader_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment RoomListItem_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n"): (typeof documents)["\n\tfragment RoomListItem_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment RoomPlantList_room on Room {\n\t\tid\n\t\tplants {\n\t\t\tid\n\t\t\t...PlantListItem_plant\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment RoomPlantList_room on Room {\n\t\tid\n\t\tplants {\n\t\t\tid\n\t\t\t...PlantListItem_plant\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery RoomsPlannerLayoutQuery {\n\t\trooms {\n\t\t\tid\n\t\t\t...RoomListItem_room\n\t\t\t...RoomHeader_room\n\t\t\t...RoomPlantList_room\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery RoomsPlannerLayoutQuery {\n\t\trooms {\n\t\t\tid\n\t\t\t...RoomListItem_room\n\t\t\t...RoomHeader_room\n\t\t\t...RoomPlantList_room\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DashboardRouteQuery {\n    privateData {\n      message\n      user {\n        email\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query DashboardRouteQuery {\n    privateData {\n      message\n      user {\n        email\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeRouteQuery {\n    healthCheck\n  }\n"): (typeof documents)["\n  query HomeRouteQuery {\n    healthCheck\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TodosRouteQuery {\n    todos {\n      completed\n      id\n      text\n    }\n  }\n"): (typeof documents)["\n  query TodosRouteQuery {\n    todos {\n      completed\n      id\n      text\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTodoMutation($text: String!) {\n    createTodo(text: $text) {\n      completed\n      id\n      text\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTodoMutation($text: String!) {\n    createTodo(text: $text) {\n      completed\n      id\n      text\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ToggleTodoMutation($completed: Boolean!, $id: Int!) {\n    toggleTodo(completed: $completed, id: $id) {\n      completed\n      id\n      text\n    }\n  }\n"): (typeof documents)["\n  mutation ToggleTodoMutation($completed: Boolean!, $id: Int!) {\n    toggleTodo(completed: $completed, id: $id) {\n      completed\n      id\n      text\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTodoMutation($id: Int!) {\n    deleteTodo(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteTodoMutation($id: Int!) {\n    deleteTodo(id: $id)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;