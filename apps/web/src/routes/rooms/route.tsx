import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
	RoomsPlannerLayout,
	RoomsPlannerLayoutQuery,
} from "@/components/rooms/rooms-planner-layout";
import { preloadQuery } from "@/lib/apollo-client";

export const Route = createFileRoute("/rooms")({
	component: RoomsLayoutRoute,
	errorComponent: ({ error }) => {
		return <RoomsPlannerLayout.Error error={error} />;
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
		<ErrorBoundary FallbackComponent={RoomsPlannerLayout.Error}>
			<Suspense fallback={<RoomsPlannerLayout.Skeleton />}>
				<RoomsPlannerLayout queryRef={queryRef} />
			</Suspense>
		</ErrorBoundary>
	);
}
