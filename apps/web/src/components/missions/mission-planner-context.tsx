import { createContext, type ReactNode, useContext } from "react";

import type { MissionPlannerLayoutQueryQuery } from "@/__gql__/graphql";

export type MissionPlannerMission =
	MissionPlannerLayoutQueryQuery["missions"][number];

interface MissionPlannerContextValue {
	missions: MissionPlannerMission[];
}

const MissionPlannerContext = createContext<MissionPlannerContextValue | null>(
	null
);

interface MissionPlannerProviderProps {
	children: ReactNode;
	missions: MissionPlannerMission[];
}

export function MissionPlannerProvider({
	children,
	missions,
}: MissionPlannerProviderProps) {
	return (
		<MissionPlannerContext.Provider value={{ missions }}>
			{children}
		</MissionPlannerContext.Provider>
	);
}

export function useMissionPlannerContext() {
	const context = useContext(MissionPlannerContext);

	if (!context) {
		throw new Error(
			"Mission planner routes must render inside MissionPlannerProvider."
		);
	}

	return context;
}
