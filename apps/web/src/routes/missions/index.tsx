import { createFileRoute } from "@tanstack/react-router";

import { MissionEmptySelection } from "@/components/missions/mission-empty-selection";

export const Route = createFileRoute("/missions/")({
	component: MissionsIndexRoute,
});

function MissionsIndexRoute() {
	return <MissionEmptySelection />;
}
