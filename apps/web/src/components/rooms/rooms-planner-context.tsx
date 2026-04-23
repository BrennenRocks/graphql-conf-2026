import { createContext, type ReactNode, useContext } from "react";

import type { RoomsPlannerLayoutQueryQuery } from "@/__gql__/graphql";

export type RoomRecord = RoomsPlannerLayoutQueryQuery["rooms"][number];

interface RoomsPlannerContextValue {
	rooms: RoomRecord[];
}

const RoomsPlannerContext = createContext<RoomsPlannerContextValue | null>(
	null
);

interface RoomsPlannerProviderProps {
	children: ReactNode;
	rooms: RoomRecord[];
}

export function RoomsPlannerProvider({
	children,
	rooms,
}: RoomsPlannerProviderProps) {
	return (
		<RoomsPlannerContext.Provider value={{ rooms }}>
			{children}
		</RoomsPlannerContext.Provider>
	);
}

export function useRoomsPlannerContext() {
	const context = useContext(RoomsPlannerContext);

	if (!context) {
		throw new Error(
			"Room planner routes must render inside RoomsPlannerProvider."
		);
	}

	return context;
}
