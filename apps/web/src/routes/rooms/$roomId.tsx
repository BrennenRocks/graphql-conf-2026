/* biome-ignore-all lint/style/useFilenamingConvention: TanStack Router dynamic segments use $param names */
import { type QueryRef, useReadQuery } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import type { DocumentType } from "@/__gql__";
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

const ROOM_PLANT_SKELETON_IDS = [
	"plant-alpha",
	"plant-bravo",
	"plant-charlie",
] as const;

const RoomDetailRouteQuery = graphql(/* GraphQL */ `
	query RoomDetailRouteQuery($id: ID!) {
		room(id: $id) {
			id
			...RoomHeader_room @nonreactive
		}
	}
`);

type RoomDetailQueryRef = QueryRef<DocumentType<typeof RoomDetailRouteQuery>>;

export const Route = createFileRoute("/rooms/$roomId")({
	component: RoomDetail,
	loader: ({ params }) => {
		return {
			carePlanQueryRef: preloadQuery(RoomCarePlanQuery, {
				variables: { id: params.roomId },
			}),
			roomDetailQueryRef: preloadQuery(RoomDetailRouteQuery, {
				variables: { id: params.roomId },
			}) satisfies RoomDetailQueryRef,
		};
	},
});

export function RoomDetail() {
	const { carePlanQueryRef, roomDetailQueryRef } = Route.useLoaderData();
	const { data } = useReadQuery(roomDetailQueryRef);

	if (!data.room) {
		return <RoomNotFound />;
	}

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<ErrorBoundary FallbackComponent={RoomHeader.Error}>
				<Suspense fallback={<RoomHeader.Skeleton />}>
					<RoomHeader room={data.room} />
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
			<Card className="border border-border/80">
				<CardHeader className="gap-3">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-5 w-24 rounded-full" />
				</CardContent>
			</Card>
			<Card className="border border-border/80">
				<CardHeader>
					<Skeleton className="h-6 w-20" />
				</CardHeader>
				<CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
					{ROOM_PLANT_SKELETON_IDS.map((skeletonId) => {
						return (
							<Card className="border border-border/80" key={skeletonId}>
								<CardHeader className="gap-2">
									<Skeleton className="h-5 w-28" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-32" />
								</CardContent>
							</Card>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}

RoomDetail.Skeleton = RoomDetailSkeleton;
RoomDetail.Error = RoomDetailError;
