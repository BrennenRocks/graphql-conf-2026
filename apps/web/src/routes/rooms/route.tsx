import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { RoomsPlannerErrorState } from "@/components/rooms/rooms-planner-error-state";
import {
	RoomsPlannerLayout,
	RoomsPlannerLayoutQuery,
} from "@/components/rooms/rooms-planner-layout";
import { RoomsPlannerLayoutSkeleton } from "@/components/rooms/rooms-planner-layout-skeleton";
import { preloadQuery } from "@/lib/apollo-client";

export const Route = createFileRoute("/rooms")({
	component: RoomsLayoutRoute,
	errorComponent: ({ error }) => {
		return <RoomsPlannerErrorState error={error} />;
	},
	loader: () => {
		return {
			queryRef: preloadQuery(RoomsPlannerLayoutQuery),
		};
	},
});

function RoomsLayoutRoute() {
	const { queryRef } = Route.useLoaderData();

	return (
		<Suspense fallback={<RoomsPlannerLayoutSkeleton />}>
			<RoomsPlannerLayout queryRef={queryRef} />
		</Suspense>
	);
}
