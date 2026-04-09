import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { MissionPlannerErrorState } from "@/components/missions/mission-planner-error-state";
import {
	MissionPlannerLayout,
	MissionPlannerLayoutQuery,
} from "@/components/missions/mission-planner-layout";
import { MissionPlannerLayoutSkeleton } from "@/components/missions/mission-planner-layout-skeleton";
import { preloadQuery } from "@/lib/apollo-client";

export const Route = createFileRoute("/missions")({
	component: MissionsLayoutRoute,
	errorComponent: ({ error }) => {
		return <MissionPlannerErrorState error={error} />;
	},
	loader: () => {
		return {
			queryRef: preloadQuery(MissionPlannerLayoutQuery),
		};
	},
});

function MissionsLayoutRoute() {
	const { queryRef } = Route.useLoaderData();

	return (
		<Suspense fallback={<MissionPlannerLayoutSkeleton />}>
			<MissionPlannerLayout queryRef={queryRef} />
		</Suspense>
	);
}
