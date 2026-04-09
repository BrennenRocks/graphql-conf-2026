/* biome-ignore-all lint/style/useFilenamingConvention: TanStack Router dynamic segments use $param names */
import { createFileRoute } from "@tanstack/react-router";

import { MissionDetailShell } from "@/components/missions/mission-detail-shell";

export const Route = createFileRoute("/missions/$missionId")({
	component: MissionDetailRoute,
});

function MissionDetailRoute() {
	return <MissionDetailShell />;
}
