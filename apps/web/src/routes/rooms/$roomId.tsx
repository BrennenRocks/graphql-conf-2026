import { useReadQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { graphql } from "@/__gql__";
import {
	RoomCarePlanPanel,
	RoomCarePlanQuery,
} from "@/components/rooms/room-care-plan-panel";
import { RoomHeader } from "@/components/rooms/room-header";
import { RoomNotFound } from "@/components/rooms/room-not-found";
import { RoomPlantList } from "@/components/rooms/room-plant-list";
import { ErrorState } from "@/components/shared/error-state";
import { preloadQuery } from "@/lib/apollo-client";

const RoomDetailRouteQuery = graphql(/* GraphQL */ `
	query RoomDetailRouteQuery($id: ID!) {
		room(id: $id) {
			id
			...RoomTitle_room @nonreactive
			...RoomDescription_room @nonreactive
			...RoomForm_room @nonreactive
			...RoomLightProfile_room @nonreactive
			...RoomPlantCountBadge_room @nonreactive
		}
	}
`);

export const Route = createFileRoute("/rooms/$roomId")({
	component: RoomDetail,
	pendingComponent: RoomDetailPending,
	loader: ({ params }) => {
		return {
			carePlanQueryRef: preloadQuery(RoomCarePlanQuery, {
				variables: { id: params.roomId },
			}),
			roomDetailQueryRef: preloadQuery(RoomDetailRouteQuery, {
				variables: { id: params.roomId },
			}),
		};
	},
});

export function RoomDetail() {
	const { carePlanQueryRef, roomDetailQueryRef } = Route.useLoaderData();
	const { data } = useReadQuery(roomDetailQueryRef);
	const roomId = data?.room?.id;

	if (!roomId) {
		return <RoomNotFound />;
	}

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<ErrorBoundary FallbackComponent={RoomHeader.Error}>
				<Suspense fallback={<RoomHeader.Skeleton />}>
					<RoomHeader roomId={roomId} />
				</Suspense>
			</ErrorBoundary>
			<ErrorBoundary FallbackComponent={RoomCarePlanPanel.Error}>
				<Suspense fallback={<RoomCarePlanPanel.Skeleton />}>
					<RoomCarePlanPanel queryRef={carePlanQueryRef} />
				</Suspense>
			</ErrorBoundary>
			<ErrorBoundary FallbackComponent={RoomPlantList.Error}>
				<RoomPlantList />
			</ErrorBoundary>
		</div>
	);
}

function RoomDetailError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div className="flex h-full min-h-0 items-center justify-center p-6">
			<ErrorState
				className="max-w-lg"
				error={error}
				onRetry={resetErrorBoundary}
				title="Unable to load this room"
			/>
		</div>
	);
}

function RoomDetailSkeleton() {
	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<RoomHeader.Skeleton />
			<RoomCarePlanPanel.Skeleton />
			<RoomPlantList.Skeleton />
		</div>
	);
}

function RoomDetailPending() {
	const { roomId } = Route.useParams();

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<ErrorBoundary FallbackComponent={RoomHeader.Error}>
				<Suspense fallback={<RoomHeader.Skeleton />}>
					<RoomHeader roomId={roomId} />
				</Suspense>
			</ErrorBoundary>
			<RoomCarePlanPanel.Skeleton />
			<RoomPlantList.Skeleton />
		</div>
	);
}

RoomDetail.Skeleton = RoomDetailSkeleton;
RoomDetail.Error = RoomDetailError;
