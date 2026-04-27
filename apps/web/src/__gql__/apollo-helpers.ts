import type { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type MutationKeySpecifier = ('createTodo' | 'deleteTodo' | 'toggleTodo' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	createTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	toggleTodo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantKeySpecifier = ('id' | 'name' | 'species' | PlantKeySpecifier)[];
export type PlantFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	species?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantCareNoteKeySpecifier = ('id' | 'name' | 'note' | 'species' | PlantCareNoteKeySpecifier)[];
export type PlantCareNoteFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	species?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PrivateDataKeySpecifier = ('message' | 'user' | PrivateDataKeySpecifier)[];
export type PrivateDataFieldPolicy = {
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('healthCheck' | 'plantCareNote' | 'privateData' | 'room' | 'roomCarePlan' | 'rooms' | 'todos' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	healthCheck?: FieldPolicy<any> | FieldReadFunction<any>,
	plantCareNote?: FieldPolicy<any> | FieldReadFunction<any>,
	privateData?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	roomCarePlan?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	todos?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoomKeySpecifier = ('description' | 'id' | 'name' | 'plantCount' | 'plants' | RoomKeySpecifier)[];
export type RoomFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plantCount?: FieldPolicy<any> | FieldReadFunction<any>,
	plants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoomCarePlanKeySpecifier = ('roomId' | 'summary' | 'tips' | RoomCarePlanKeySpecifier)[];
export type RoomCarePlanFieldPolicy = {
	roomId?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>,
	tips?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TodoKeySpecifier = ('completed' | 'id' | 'text' | TodoKeySpecifier)[];
export type TodoFieldPolicy = {
	completed?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ViewerKeySpecifier = ('email' | 'id' | 'name' | ViewerKeySpecifier)[];
export type ViewerFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Plant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantKeySpecifier | (() => undefined | PlantKeySpecifier),
		fields?: PlantFieldPolicy,
	},
	PlantCareNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantCareNoteKeySpecifier | (() => undefined | PlantCareNoteKeySpecifier),
		fields?: PlantCareNoteFieldPolicy,
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
	Todo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TodoKeySpecifier | (() => undefined | TodoKeySpecifier),
		fields?: TodoFieldPolicy,
	},
	Viewer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ViewerKeySpecifier | (() => undefined | ViewerKeySpecifier),
		fields?: ViewerFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;