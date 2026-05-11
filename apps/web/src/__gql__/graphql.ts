/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename: 'Mutation';
  createTodo: Todo;
  deleteTodo: Scalars['Int']['output'];
  toggleTodo: Todo;
};


export type MutationCreateTodoArgs = {
  text: Scalars['String']['input'];
};


export type MutationDeleteTodoArgs = {
  id: Scalars['Int']['input'];
};


export type MutationToggleTodoArgs = {
  completed: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type Plant = {
  __typename: 'Plant';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  species: Scalars['String']['output'];
};

export type PlantCareNote = {
  __typename: 'PlantCareNote';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  species: Scalars['String']['output'];
};

export type PlantConnection = {
  __typename: 'PlantConnection';
  edges: Array<PlantEdge>;
  pageInfo: PageInfo;
};

export type PlantEdge = {
  __typename: 'PlantEdge';
  cursor: Scalars['String']['output'];
  node: Plant;
};

export type PrivateData = {
  __typename: 'PrivateData';
  message: Scalars['String']['output'];
  user: Viewer;
};

export type Query = {
  __typename: 'Query';
  healthCheck: Scalars['String']['output'];
  plantCareNote: PlantCareNote;
  privateData: PrivateData;
  room?: Maybe<Room>;
  roomCarePlan: RoomCarePlan;
  rooms: Array<Room>;
  roomsConnection: RoomConnection;
  todos: Array<Todo>;
};


export type QueryPlantCareNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoomCarePlanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoomsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRoomsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type Room = {
  __typename: 'Room';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  plantCount: Scalars['Int']['output'];
  plants: Array<Plant>;
  plantsConnection: PlantConnection;
};


export type RoomPlantsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type RoomCarePlan = {
  __typename: 'RoomCarePlan';
  roomId: Scalars['ID']['output'];
  summary: Scalars['String']['output'];
  tips: Array<Scalars['String']['output']>;
};

export type RoomConnection = {
  __typename: 'RoomConnection';
  edges: Array<RoomEdge>;
  pageInfo: PageInfo;
};

export type RoomEdge = {
  __typename: 'RoomEdge';
  cursor: Scalars['String']['output'];
  node: Room;
};

export type Todo = {
  __typename: 'Todo';
  completed: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type Viewer = {
  __typename: 'Viewer';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PlantCareNoteQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PlantCareNoteQueryQuery = { __typename: 'Query', plantCareNote: { __typename: 'PlantCareNote', id: string, name: string, species: string, note: string } };

export type PlantListItem_PlantFragment = { __typename: 'Plant', id: string, name: string, species: string } & { ' $fragmentName'?: 'PlantListItem_PlantFragment' };

export type RoomCarePlanQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RoomCarePlanQueryQuery = { __typename: 'Query', roomCarePlan: { __typename: 'RoomCarePlan', roomId: string, summary: string, tips: Array<string> } };

export type RoomHeader_RoomFragment = { __typename: 'Room', id: string, name: string, description: string, plantCount: number } & { ' $fragmentName'?: 'RoomHeader_RoomFragment' };

export type RoomListItem_RoomFragment = { __typename: 'Room', id: string, name: string, description: string, plantCount: number } & { ' $fragmentName'?: 'RoomListItem_RoomFragment' };

export type RoomPlantListQueryQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type RoomPlantListQueryQuery = { __typename: 'Query', room?: { __typename: 'Room', id: string, plantsConnection: { __typename: 'PlantConnection', edges: Array<{ __typename: 'PlantEdge', cursor: string, node: (
          { __typename: 'Plant', id: string, name: string }
          & { ' $fragmentRefs'?: { 'PlantListItem_PlantFragment': PlantListItem_PlantFragment } }
        ) }>, pageInfo: { __typename: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } } | null };

export type RoomsPlannerLayoutQueryQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type RoomsPlannerLayoutQueryQuery = { __typename: 'Query', roomsConnection: { __typename: 'RoomConnection', edges: Array<{ __typename: 'RoomEdge', cursor: string, node: (
        { __typename: 'Room', id: string }
        & { ' $fragmentRefs'?: { 'RoomListItem_RoomFragment': RoomListItem_RoomFragment } }
      ) }>, pageInfo: { __typename: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type DashboardRouteQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardRouteQueryQuery = { __typename: 'Query', privateData: { __typename: 'PrivateData', message: string, user: { __typename: 'Viewer', email: string, id: string, name: string } } };

export type HomeRouteQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeRouteQueryQuery = { __typename: 'Query', healthCheck: string };

export type RoomDetailRouteQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RoomDetailRouteQueryQuery = { __typename: 'Query', room?: (
    { __typename: 'Room', id: string }
    & { ' $fragmentRefs'?: { 'RoomHeader_RoomFragment': RoomHeader_RoomFragment } }
  ) | null };

export type TodosRouteQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type TodosRouteQueryQuery = { __typename: 'Query', todos: Array<{ __typename: 'Todo', completed: boolean, id: number, text: string }> };

export type CreateTodoMutationMutationVariables = Exact<{
  text: Scalars['String']['input'];
}>;


export type CreateTodoMutationMutation = { __typename: 'Mutation', createTodo: { __typename: 'Todo', completed: boolean, id: number, text: string } };

export type ToggleTodoMutationMutationVariables = Exact<{
  completed: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
}>;


export type ToggleTodoMutationMutation = { __typename: 'Mutation', toggleTodo: { __typename: 'Todo', completed: boolean, id: number, text: string } };

export type DeleteTodoMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTodoMutationMutation = { __typename: 'Mutation', deleteTodo: number };

export const PlantListItem_PlantFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantListItem_plant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Plant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}}]}}]} as unknown as DocumentNode<PlantListItem_PlantFragment, unknown>;
export const RoomHeader_RoomFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomHeader_room"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}}]}}]} as unknown as DocumentNode<RoomHeader_RoomFragment, unknown>;
export const RoomListItem_RoomFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomListItem_room"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}}]}}]} as unknown as DocumentNode<RoomListItem_RoomFragment, unknown>;
export const PlantCareNoteQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlantCareNoteQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plantCareNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<PlantCareNoteQueryQuery, PlantCareNoteQueryQueryVariables>;
export const RoomCarePlanQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoomCarePlanQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomCarePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"tips"}}]}}]}}]} as unknown as DocumentNode<RoomCarePlanQueryQuery, RoomCarePlanQueryQueryVariables>;
export const RoomPlantListQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoomPlantListQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"plantsConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantListItem_plant"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantListItem_plant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Plant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"species"}}]}}]} as unknown as DocumentNode<RoomPlantListQueryQuery, RoomPlantListQueryQueryVariables>;
export const RoomsPlannerLayoutQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoomsPlannerLayoutQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomsConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomListItem_room"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomListItem_room"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}}]}}]} as unknown as DocumentNode<RoomsPlannerLayoutQueryQuery, RoomsPlannerLayoutQueryQueryVariables>;
export const DashboardRouteQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardRouteQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privateData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<DashboardRouteQueryQuery, DashboardRouteQueryQueryVariables>;
export const HomeRouteQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomeRouteQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"healthCheck"}}]}}]} as unknown as DocumentNode<HomeRouteQueryQuery, HomeRouteQueryQueryVariables>;
export const RoomDetailRouteQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoomDetailRouteQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomHeader_room"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomHeader_room"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}}]}}]} as unknown as DocumentNode<RoomDetailRouteQueryQuery, RoomDetailRouteQueryQueryVariables>;
export const TodosRouteQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TodosRouteQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<TodosRouteQueryQuery, TodosRouteQueryQueryVariables>;
export const CreateTodoMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTodoMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTodo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<CreateTodoMutationMutation, CreateTodoMutationMutationVariables>;
export const ToggleTodoMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleTodoMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"completed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleTodo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"completed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"completed"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<ToggleTodoMutationMutation, ToggleTodoMutationMutationVariables>;
export const DeleteTodoMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTodoMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTodo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTodoMutationMutation, DeleteTodoMutationMutationVariables>;