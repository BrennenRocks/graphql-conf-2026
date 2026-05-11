import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { RoomsPlannerLayout } from "@/components/rooms/rooms-planner-layout";

export const Route = createFileRoute("/rooms")({
	component: RoomsLayoutRoute,
	errorComponent: ({ error }) => {
		return <RoomsPlannerLayout.Error error={error} />;
	},
});

function RoomsLayoutRoute() {
	return (
		<ErrorBoundary FallbackComponent={RoomsPlannerLayout.Error}>
			<Suspense fallback={<RoomsPlannerLayout.Skeleton />}>
				<RoomsPlannerLayout />
			</Suspense>
		</ErrorBoundary>
	);
}
