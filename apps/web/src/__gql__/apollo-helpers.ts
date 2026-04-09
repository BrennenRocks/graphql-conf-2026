import type { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type CrewMemberKeySpecifier = ('active' | 'bio' | 'callSign' | 'id' | 'name' | 'role' | CrewMemberKeySpecifier)[];
export type CrewMemberFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	bio?: FieldPolicy<any> | FieldReadFunction<any>,
	callSign?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FactionKeySpecifier = ('description' | 'id' | 'name' | FactionKeySpecifier)[];
export type FactionFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MissionKeySpecifier = ('codeName' | 'crewAssignments' | 'destination' | 'faction' | 'id' | 'payout' | 'riskLevel' | 'ship' | 'status' | 'summary' | 'targetName' | 'toolAssignments' | MissionKeySpecifier)[];
export type MissionFieldPolicy = {
	codeName?: FieldPolicy<any> | FieldReadFunction<any>,
	crewAssignments?: FieldPolicy<any> | FieldReadFunction<any>,
	destination?: FieldPolicy<any> | FieldReadFunction<any>,
	faction?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	payout?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevel?: FieldPolicy<any> | FieldReadFunction<any>,
	ship?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>,
	targetName?: FieldPolicy<any> | FieldReadFunction<any>,
	toolAssignments?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MissionCrewAssignmentKeySpecifier = ('assignmentOrder' | 'crewMember' | MissionCrewAssignmentKeySpecifier)[];
export type MissionCrewAssignmentFieldPolicy = {
	assignmentOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	crewMember?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MissionToolAssignmentKeySpecifier = ('quantity' | 'tool' | MissionToolAssignmentKeySpecifier)[];
export type MissionToolAssignmentFieldPolicy = {
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	tool?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('createTodo' | 'deleteTodo' | 'toggleTodo' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	createTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	toggleTodo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PrivateDataKeySpecifier = ('message' | 'user' | PrivateDataKeySpecifier)[];
export type PrivateDataFieldPolicy = {
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('crewMembers' | 'factions' | 'healthCheck' | 'mission' | 'missions' | 'privateData' | 'ships' | 'todos' | 'tools' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	crewMembers?: FieldPolicy<any> | FieldReadFunction<any>,
	factions?: FieldPolicy<any> | FieldReadFunction<any>,
	healthCheck?: FieldPolicy<any> | FieldReadFunction<any>,
	mission?: FieldPolicy<any> | FieldReadFunction<any>,
	missions?: FieldPolicy<any> | FieldReadFunction<any>,
	privateData?: FieldPolicy<any> | FieldReadFunction<any>,
	ships?: FieldPolicy<any> | FieldReadFunction<any>,
	todos?: FieldPolicy<any> | FieldReadFunction<any>,
	tools?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipKeySpecifier = ('cargoSlots' | 'id' | 'name' | 'shipClass' | 'stealthRating' | ShipKeySpecifier)[];
export type ShipFieldPolicy = {
	cargoSlots?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	shipClass?: FieldPolicy<any> | FieldReadFunction<any>,
	stealthRating?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TodoKeySpecifier = ('completed' | 'id' | 'text' | TodoKeySpecifier)[];
export type TodoFieldPolicy = {
	completed?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ToolKeySpecifier = ('category' | 'description' | 'id' | 'name' | ToolKeySpecifier)[];
export type ToolFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ViewerKeySpecifier = ('email' | 'id' | 'name' | ViewerKeySpecifier)[];
export type ViewerFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	CrewMember?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CrewMemberKeySpecifier | (() => undefined | CrewMemberKeySpecifier),
		fields?: CrewMemberFieldPolicy,
	},
	Faction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FactionKeySpecifier | (() => undefined | FactionKeySpecifier),
		fields?: FactionFieldPolicy,
	},
	Mission?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MissionKeySpecifier | (() => undefined | MissionKeySpecifier),
		fields?: MissionFieldPolicy,
	},
	MissionCrewAssignment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MissionCrewAssignmentKeySpecifier | (() => undefined | MissionCrewAssignmentKeySpecifier),
		fields?: MissionCrewAssignmentFieldPolicy,
	},
	MissionToolAssignment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MissionToolAssignmentKeySpecifier | (() => undefined | MissionToolAssignmentKeySpecifier),
		fields?: MissionToolAssignmentFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	PrivateData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PrivateDataKeySpecifier | (() => undefined | PrivateDataKeySpecifier),
		fields?: PrivateDataFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Ship?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipKeySpecifier | (() => undefined | ShipKeySpecifier),
		fields?: ShipFieldPolicy,
	},
	Todo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TodoKeySpecifier | (() => undefined | TodoKeySpecifier),
		fields?: TodoFieldPolicy,
	},
	Tool?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ToolKeySpecifier | (() => undefined | ToolKeySpecifier),
		fields?: ToolFieldPolicy,
	},
	Viewer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ViewerKeySpecifier | (() => undefined | ViewerKeySpecifier),
		fields?: ViewerFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;