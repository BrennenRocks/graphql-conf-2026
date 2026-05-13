import type { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type CreatePlantPayloadKeySpecifier = ('plant' | 'plantEdge' | 'previousRoom' | 'room' | CreatePlantPayloadKeySpecifier)[];
export type CreatePlantPayloadFieldPolicy = {
	plant?: FieldPolicy<any> | FieldReadFunction<any>,
	plantEdge?: FieldPolicy<any> | FieldReadFunction<any>,
	previousRoom?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateRoomPayloadKeySpecifier = ('room' | 'roomEdge' | CreateRoomPayloadKeySpecifier)[];
export type CreateRoomPayloadFieldPolicy = {
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	roomEdge?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('createPlant' | 'createRoom' | 'createTodo' | 'deleteTodo' | 'toggleTodo' | 'updatePlant' | 'updateRoom' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	createPlant?: FieldPolicy<any> | FieldReadFunction<any>,
	createRoom?: FieldPolicy<any> | FieldReadFunction<any>,
	createTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	toggleTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	updatePlant?: FieldPolicy<any> | FieldReadFunction<any>,
	updateRoom?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('endCursor' | 'hasNextPage' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantKeySpecifier = ('id' | 'name' | 'roomId' | 'species' | PlantKeySpecifier)[];
export type PlantFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	roomId?: FieldPolicy<any> | FieldReadFunction<any>,
	species?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantCareNoteKeySpecifier = ('id' | 'name' | 'note' | 'species' | PlantCareNoteKeySpecifier)[];
export type PlantCareNoteFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	species?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantConnectionKeySpecifier = ('edges' | 'pageInfo' | PlantConnectionKeySpecifier)[];
export type PlantConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantEdgeKeySpecifier = ('cursor' | 'node' | PlantEdgeKeySpecifier)[];
export type PlantEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PrivateDataKeySpecifier = ('message' | 'user' | PrivateDataKeySpecifier)[];
export type PrivateDataFieldPolicy = {
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('healthCheck' | 'plantCareNote' | 'privateData' | 'room' | 'roomCarePlan' | 'rooms' | 'roomsConnection' | 'todos' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	healthCheck?: FieldPolicy<any> | FieldReadFunction<any>,
	plantCareNote?: FieldPolicy<any> | FieldReadFunction<any>,
	privateData?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	roomCarePlan?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	roomsConnection?: FieldPolicy<any> | FieldReadFunction<any>,
	todos?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoomKeySpecifier = ('description' | 'id' | 'name' | 'plantCount' | 'plants' | 'plantsConnection' | RoomKeySpecifier)[];
export type RoomFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plantCount?: FieldPolicy<any> | FieldReadFunction<any>,
	plants?: FieldPolicy<any> | FieldReadFunction<any>,
	plantsConnection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoomCarePlanKeySpecifier = ('roomId' | 'summary' | 'tips' | RoomCarePlanKeySpecifier)[];
export type RoomCarePlanFieldPolicy = {
	roomId?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>,
	tips?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoomConnectionKeySpecifier = ('edges' | 'pageInfo' | RoomConnectionKeySpecifier)[];
export type RoomConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoomEdgeKeySpecifier = ('cursor' | 'node' | RoomEdgeKeySpecifier)[];
export type RoomEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TodoKeySpecifier = ('completed' | 'id' | 'text' | TodoKeySpecifier)[];
export type TodoFieldPolicy = {
	completed?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdatePlantPayloadKeySpecifier = ('plant' | 'plantEdge' | 'previousRoom' | 'room' | UpdatePlantPayloadKeySpecifier)[];
export type UpdatePlantPayloadFieldPolicy = {
	plant?: FieldPolicy<any> | FieldReadFunction<any>,
	plantEdge?: FieldPolicy<any> | FieldReadFunction<any>,
	previousRoom?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateRoomPayloadKeySpecifier = ('room' | 'roomEdge' | UpdateRoomPayloadKeySpecifier)[];
export type UpdateRoomPayloadFieldPolicy = {
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	roomEdge?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ViewerKeySpecifier = ('email' | 'id' | 'name' | ViewerKeySpecifier)[];
export type ViewerFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	CreatePlantPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreatePlantPayloadKeySpecifier | (() => undefined | CreatePlantPayloadKeySpecifier),
		fields?: CreatePlantPayloadFieldPolicy,
	},
	CreateRoomPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateRoomPayloadKeySpecifier | (() => undefined | CreateRoomPayloadKeySpecifier),
		fields?: CreateRoomPayloadFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	Plant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantKeySpecifier | (() => undefined | PlantKeySpecifier),
		fields?: PlantFieldPolicy,
	},
	PlantCareNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantCareNoteKeySpecifier | (() => undefined | PlantCareNoteKeySpecifier),
		fields?: PlantCareNoteFieldPolicy,
	},
	PlantConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantConnectionKeySpecifier | (() => undefined | PlantConnectionKeySpecifier),
		fields?: PlantConnectionFieldPolicy,
	},
	PlantEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantEdgeKeySpecifier | (() => undefined | PlantEdgeKeySpecifier),
		fields?: PlantEdgeFieldPolicy,
	},
	PrivateData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PrivateDataKeySpecifier | (() => undefined | PrivateDataKeySpecifier),
		fields?: PrivateDataFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Room?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoomKeySpecifier | (() => undefined | RoomKeySpecifier),
		fields?: RoomFieldPolicy,
	},
	RoomCarePlan?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoomCarePlanKeySpecifier | (() => undefined | RoomCarePlanKeySpecifier),
		fields?: RoomCarePlanFieldPolicy,
	},
	RoomConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoomConnectionKeySpecifier | (() => undefined | RoomConnectionKeySpecifier),
		fields?: RoomConnectionFieldPolicy,
	},
	RoomEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoomEdgeKeySpecifier | (() => undefined | RoomEdgeKeySpecifier),
		fields?: RoomEdgeFieldPolicy,
	},
	Todo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TodoKeySpecifier | (() => undefined | TodoKeySpecifier),
		fields?: TodoFieldPolicy,
	},
	UpdatePlantPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdatePlantPayloadKeySpecifier | (() => undefined | UpdatePlantPayloadKeySpecifier),
		fields?: UpdatePlantPayloadFieldPolicy,
	},
	UpdateRoomPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateRoomPayloadKeySpecifier | (() => undefined | UpdateRoomPayloadKeySpecifier),
		fields?: UpdateRoomPayloadFieldPolicy,
	},
	Viewer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ViewerKeySpecifier | (() => undefined | ViewerKeySpecifier),
		fields?: ViewerFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;