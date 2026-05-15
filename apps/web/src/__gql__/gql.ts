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
    "\n\tquery PlantCareNoteQuery($id: ID!) {\n\t\tplantCareNote(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tspecies\n\t\t\tnote\n\t\t}\n\t}\n": typeof types.PlantCareNoteQueryDocument,
    "\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\troomId\n\t\tname\n\t\tspecies\n\t}\n": typeof types.PlantListItem_PlantFragmentDoc,
    "\n\tfragment RoomPlantCount_room on Room {\n\t\tplantCount\n\t}\n": typeof types.RoomPlantCount_RoomFragmentDoc,
    "\n\tquery RoomCarePlanQuery($id: ID!) {\n\t\troomCarePlan(id: $id) {\n\t\t\troomId\n\t\t\tsummary\n\t\t\ttips\n\t\t}\n\t}\n": typeof types.RoomCarePlanQueryDocument,
    "\n\tfragment RoomHeader_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": typeof types.RoomHeader_RoomFragmentDoc,
    "\n\tfragment RoomListItem_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": typeof types.RoomListItem_RoomFragmentDoc,
    "\n\tmutation CreateRoomMutation($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": typeof types.CreateRoomMutationDocument,
    "\n\tmutation UpdateRoomMutation($input: UpdateRoomInput!) {\n\t\tupdateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": typeof types.UpdateRoomMutationDocument,
    "\n\tmutation CreatePlantMutation($input: CreatePlantInput!) {\n\t\tcreatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n": typeof types.CreatePlantMutationDocument,
    "\n\tmutation UpdatePlantMutation($input: UpdatePlantInput!) {\n\t\tupdatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n": typeof types.UpdatePlantMutationDocument,
    "\n\tquery RoomPickerQuery {\n\t\troomsConnection(first: 50) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": typeof types.RoomPickerQueryDocument,
    "\n\tquery RoomPlantListQuery($roomId: ID!, $first: Int!, $after: String) {\n\t\troom(id: $roomId) {\n\t\t\tid\n\t\t\tplantsConnection(first: $first, after: $after) {\n\t\t\t\tedges {\n\t\t\t\t\tcursor\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\t...PlantListItem_plant\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\tendCursor\n\t\t\t\t\thasNextPage\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": typeof types.RoomPlantListQueryDocument,
    "\n\tquery RoomsPlannerLayoutQuery($first: Int!, $after: String) {\n\t\troomsConnection(first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\t...RoomListItem_room @nonreactive\n\t\t\t\t}\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\tendCursor\n\t\t\t\thasNextPage\n\t\t\t}\n\t\t}\n\t}\n": typeof types.RoomsPlannerLayoutQueryDocument,
    "\n  query HomeRouteQuery {\n    healthCheck\n  }\n": typeof types.HomeRouteQueryDocument,
    "\n\tquery RoomDetailRouteQuery($id: ID!) {\n\t\troom(id: $id) {\n\t\t\tid\n\t\t\t...RoomHeader_room @nonreactive\n\t\t}\n\t}\n": typeof types.RoomDetailRouteQueryDocument,
};
const documents: Documents = {
    "\n\tquery PlantCareNoteQuery($id: ID!) {\n\t\tplantCareNote(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tspecies\n\t\t\tnote\n\t\t}\n\t}\n": types.PlantCareNoteQueryDocument,
    "\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\troomId\n\t\tname\n\t\tspecies\n\t}\n": types.PlantListItem_PlantFragmentDoc,
    "\n\tfragment RoomPlantCount_room on Room {\n\t\tplantCount\n\t}\n": types.RoomPlantCount_RoomFragmentDoc,
    "\n\tquery RoomCarePlanQuery($id: ID!) {\n\t\troomCarePlan(id: $id) {\n\t\t\troomId\n\t\t\tsummary\n\t\t\ttips\n\t\t}\n\t}\n": types.RoomCarePlanQueryDocument,
    "\n\tfragment RoomHeader_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": types.RoomHeader_RoomFragmentDoc,
    "\n\tfragment RoomListItem_room on Room {\n\t\tid\n\t\tname\n\t\tdescription\n\t\tplantCount\n\t}\n": types.RoomListItem_RoomFragmentDoc,
    "\n\tmutation CreateRoomMutation($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.CreateRoomMutationDocument,
    "\n\tmutation UpdateRoomMutation($input: UpdateRoomInput!) {\n\t\tupdateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.UpdateRoomMutationDocument,
    "\n\tmutation CreatePlantMutation($input: CreatePlantInput!) {\n\t\tcreatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n": types.CreatePlantMutationDocument,
    "\n\tmutation UpdatePlantMutation($input: UpdatePlantInput!) {\n\t\tupdatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n": types.UpdatePlantMutationDocument,
    "\n\tquery RoomPickerQuery {\n\t\troomsConnection(first: 50) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.RoomPickerQueryDocument,
    "\n\tquery RoomPlantListQuery($roomId: ID!, $first: Int!, $after: String) {\n\t\troom(id: $roomId) {\n\t\t\tid\n\t\t\tplantsConnection(first: $first, after: $after) {\n\t\t\t\tedges {\n\t\t\t\t\tcursor\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\t...PlantListItem_plant\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\tendCursor\n\t\t\t\t\thasNextPage\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.RoomPlantListQueryDocument,
    "\n\tquery RoomsPlannerLayoutQuery($first: Int!, $after: String) {\n\t\troomsConnection(first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\t...RoomListItem_room @nonreactive\n\t\t\t\t}\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\tendCursor\n\t\t\t\thasNextPage\n\t\t\t}\n\t\t}\n\t}\n": types.RoomsPlannerLayoutQueryDocument,
    "\n  query HomeRouteQuery {\n    healthCheck\n  }\n": types.HomeRouteQueryDocument,
    "\n\tquery RoomDetailRouteQuery($id: ID!) {\n\t\troom(id: $id) {\n\t\t\tid\n\t\t\t...RoomHeader_room @nonreactive\n\t\t}\n\t}\n": types.RoomDetailRouteQueryDocument,
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
export function graphql(source: "\n\tquery PlantCareNoteQuery($id: ID!) {\n\t\tplantCareNote(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tspecies\n\t\t\tnote\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery PlantCareNoteQuery($id: ID!) {\n\t\tplantCareNote(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tspecies\n\t\t\tnote\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\troomId\n\t\tname\n\t\tspecies\n\t}\n"): (typeof documents)["\n\tfragment PlantListItem_plant on Plant {\n\t\tid\n\t\troomId\n\t\tname\n\t\tspecies\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment RoomPlantCount_room on Room {\n\t\tplantCount\n\t}\n"): (typeof documents)["\n\tfragment RoomPlantCount_room on Room {\n\t\tplantCount\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery RoomCarePlanQuery($id: ID!) {\n\t\troomCarePlan(id: $id) {\n\t\t\troomId\n\t\t\tsummary\n\t\t\ttips\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery RoomCarePlanQuery($id: ID!) {\n\t\troomCarePlan(id: $id) {\n\t\t\troomId\n\t\t\tsummary\n\t\t\ttips\n\t\t}\n\t}\n"];
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
export function graphql(source: "\n\tmutation CreateRoomMutation($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateRoomMutation($input: CreateRoomInput!) {\n\t\tcreateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UpdateRoomMutation($input: UpdateRoomInput!) {\n\t\tupdateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdateRoomMutation($input: UpdateRoomInput!) {\n\t\tupdateRoom(input: $input) {\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdescription\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\troomEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tdescription\n\t\t\t\t\tplantCount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation CreatePlantMutation($input: CreatePlantInput!) {\n\t\tcreatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreatePlantMutation($input: CreatePlantInput!) {\n\t\tcreatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UpdatePlantMutation($input: UpdatePlantInput!) {\n\t\tupdatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdatePlantMutation($input: UpdatePlantInput!) {\n\t\tupdatePlant(input: $input) {\n\t\t\tplant {\n\t\t\t\tid\n\t\t\t\troomId\n\t\t\t\tname\n\t\t\t\tspecies\n\t\t\t}\n\t\t\tplantEdge {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\troomId\n\t\t\t\t\tname\n\t\t\t\t\tspecies\n\t\t\t\t}\n\t\t\t}\n\t\t\troom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t\tpreviousRoom {\n\t\t\t\tid\n\t\t\t\tplantCount\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery RoomPickerQuery {\n\t\troomsConnection(first: 50) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery RoomPickerQuery {\n\t\troomsConnection(first: 50) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery RoomPlantListQuery($roomId: ID!, $first: Int!, $after: String) {\n\t\troom(id: $roomId) {\n\t\t\tid\n\t\t\tplantsConnection(first: $first, after: $after) {\n\t\t\t\tedges {\n\t\t\t\t\tcursor\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\t...PlantListItem_plant\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\tendCursor\n\t\t\t\t\thasNextPage\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery RoomPlantListQuery($roomId: ID!, $first: Int!, $after: String) {\n\t\troom(id: $roomId) {\n\t\t\tid\n\t\t\tplantsConnection(first: $first, after: $after) {\n\t\t\t\tedges {\n\t\t\t\t\tcursor\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\t...PlantListItem_plant\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\tendCursor\n\t\t\t\t\thasNextPage\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery RoomsPlannerLayoutQuery($first: Int!, $after: String) {\n\t\troomsConnection(first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\t...RoomListItem_room @nonreactive\n\t\t\t\t}\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\tendCursor\n\t\t\t\thasNextPage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery RoomsPlannerLayoutQuery($first: Int!, $after: String) {\n\t\troomsConnection(first: $first, after: $after) {\n\t\t\tedges {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\t...RoomListItem_room @nonreactive\n\t\t\t\t}\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\tendCursor\n\t\t\t\thasNextPage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeRouteQuery {\n    healthCheck\n  }\n"): (typeof documents)["\n  query HomeRouteQuery {\n    healthCheck\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery RoomDetailRouteQuery($id: ID!) {\n\t\troom(id: $id) {\n\t\t\tid\n\t\t\t...RoomHeader_room @nonreactive\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery RoomDetailRouteQuery($id: ID!) {\n\t\troom(id: $id) {\n\t\t\tid\n\t\t\t...RoomHeader_room @nonreactive\n\t\t}\n\t}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;