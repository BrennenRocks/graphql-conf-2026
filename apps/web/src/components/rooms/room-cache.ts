import type {
	ApolloCache,
	FieldFunctionOptions,
	Reference,
	StoreObject,
} from "@apollo/client";
import { gql } from "@apollo/client";

type ConnectionEdge = Reference | StoreObject;

interface CacheRoom {
	__typename: "Room";
	id: string;
	plantCount?: number;
}

interface CachePlant {
	__typename: "Plant";
	id: string;
	name: string;
	roomId: string;
	species: string;
}

interface CacheRoomEdge {
	__typename: "RoomEdge";
	cursor: string;
	node: CacheRoom;
}

interface CachePlantEdge {
	__typename: "PlantEdge";
	cursor: string;
	node: CachePlant;
}

interface Connection {
	__typename?: string;
	edges?: readonly ConnectionEdge[];
	pageInfo?: {
		__typename?: string;
		endCursor?: null | string;
		hasNextPage?: boolean;
	};
}

const RoomPlantCountFragment = gql`
	fragment RoomPlantCount_room on Room {
		plantCount
	}
`;

type ExistingConnection = Connection | Reference | undefined;

interface CacheModifierOptions {
	readField: FieldFunctionOptions["readField"];
	toReference: FieldFunctionOptions["toReference"];
}

const isConnection = (value: ExistingConnection): value is Connection => {
	return typeof value === "object" && value !== null && !("__ref" in value);
};

const getEdgeNodeId = (
	edge: ConnectionEdge,
	readField: FieldFunctionOptions["readField"]
) => {
	const node = readField<Reference | StoreObject>("node", edge);

	return node ? readField<string>("id", node) : undefined;
};

const getPlantSortValue = (
	edge: ConnectionEdge,
	readField: FieldFunctionOptions["readField"]
) => {
	const node = readField<Reference | StoreObject>("node", edge);
	const name = node ? (readField<string>("name", node) ?? "") : "";
	const id = node ? (readField<string>("id", node) ?? "") : "";

	return { id, name };
};

const createConnection = (
	typename: string,
	edge: ConnectionEdge
): Connection => {
	return {
		__typename: typename,
		edges: [edge],
		pageInfo: {
			__typename: "PageInfo",
			endCursor: null,
			hasNextPage: false,
		},
	};
};

const createRoomEdge = (
	edge: CacheRoomEdge,
	toReference: FieldFunctionOptions["toReference"]
): StoreObject | undefined => {
	const roomRef = toReference(edge.node as unknown as StoreObject, true);

	if (!roomRef) {
		return undefined;
	}

	return {
		__typename: "RoomEdge",
		cursor: edge.cursor,
		node: roomRef,
	};
};

const createPlantEdge = (
	edge: CachePlantEdge,
	toReference: FieldFunctionOptions["toReference"]
): StoreObject | undefined => {
	const plantRef = toReference(edge.node as unknown as StoreObject, true);

	if (!plantRef) {
		return undefined;
	}

	return {
		__typename: "PlantEdge",
		cursor: edge.cursor,
		node: plantRef,
	};
};

export const readRoomPlantCount = (cache: ApolloCache, roomId: string) => {
	const room = cache.readFragment<{ plantCount: number }>({
		fragment: RoomPlantCountFragment,
		id: cache.identify({
			__typename: "Room",
			id: roomId,
		}),
	});

	return room?.plantCount ?? 0;
};

export const addRoomEdgeToRoomsConnection = (
	cache: ApolloCache,
	roomEdge: CacheRoomEdge
) => {
	cache.modify({
		fields: {
			roomsConnection(
				existing: ExistingConnection,
				options: CacheModifierOptions
			) {
				const edge = createRoomEdge(roomEdge, options.toReference);

				if (!edge) {
					return existing;
				}

				if (!isConnection(existing)) {
					return createConnection("RoomConnection", edge);
				}

				const roomId = roomEdge.node.id;
				const edges = existing.edges ?? [];
				const filteredEdges = edges.filter((existingEdge) => {
					return getEdgeNodeId(existingEdge, options.readField) !== roomId;
				});

				return {
					...existing,
					edges: [edge, ...filteredEdges],
				};
			},
		},
	});
};

export const addOrReplacePlantEdgeInRoom = (
	cache: ApolloCache,
	roomId: string,
	plantEdge: CachePlantEdge
) => {
	cache.modify({
		id: cache.identify({
			__typename: "Room",
			id: roomId,
		}),
		fields: {
			plantsConnection(
				existing: ExistingConnection,
				options: CacheModifierOptions
			) {
				const edge = createPlantEdge(plantEdge, options.toReference);

				if (!edge) {
					return existing;
				}

				if (!isConnection(existing)) {
					return createConnection("PlantConnection", edge);
				}

				const plantId = plantEdge.node.id;
				const filteredEdges = (existing.edges ?? []).filter((existingEdge) => {
					return getEdgeNodeId(existingEdge, options.readField) !== plantId;
				});
				const edges = [...filteredEdges, edge].sort((leftEdge, rightEdge) => {
					const left = getPlantSortValue(leftEdge, options.readField);
					const right = getPlantSortValue(rightEdge, options.readField);
					const nameComparison = left.name.localeCompare(right.name);

					return nameComparison === 0
						? left.id.localeCompare(right.id)
						: nameComparison;
				});

				return {
					...existing,
					edges,
				};
			},
		},
	});
};

export const removePlantEdgeFromRoom = (
	cache: ApolloCache,
	roomId: string,
	plantId: string
) => {
	cache.modify({
		id: cache.identify({
			__typename: "Room",
			id: roomId,
		}),
		fields: {
			plantsConnection(
				existing: ExistingConnection,
				options: CacheModifierOptions
			) {
				if (!isConnection(existing)) {
					return existing;
				}

				return {
					...existing,
					edges: (existing.edges ?? []).filter((edge) => {
						return getEdgeNodeId(edge, options.readField) !== plantId;
					}),
				};
			},
		},
	});
};
