import { useSuspenseQuery } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { Outlet } from "@tanstack/react-router";
import { useCallback, useState, useTransition } from "react";

import { graphql } from "@/__gql__";
import type { RoomsPlannerLayoutQueryQuery } from "@/__gql__/graphql";
import { RoomDetail } from "@/routes/rooms/$roomId";
import { RoomList } from "./room-list";

const ROOM_LIST_SKELETON_IDS = [
	"room-alpha",
	"room-bravo",
	"room-charlie",
	"room-delta",
] as const;

const ROOM_PAGE_SIZE = 8;

interface RoomsPlannerLayoutErrorProps {
	error: unknown;
	resetErrorBoundary?: () => void;
}

export const RoomsPlannerLayoutQuery = graphql(/* GraphQL */ `
	query RoomsPlannerLayoutQuery($first: Int!, $after: String) {
		roomsConnection(first: $first, after: $after) {
			edges {
				cursor
				node {
					id
					...RoomListItem_room
				}
			}
			pageInfo {
				endCursor
				hasNextPage
			}
		}
	}
`);

export type RoomsPlannerRoom =
	RoomsPlannerLayoutQueryQuery["roomsConnection"]["edges"][number]["node"];

export function RoomsPlannerLayout() {
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { data, fetchMore } = useSuspenseQuery(RoomsPlannerLayoutQuery, {
		variables: {
			first: ROOM_PAGE_SIZE,
		},
	});
	const roomsConnection = data.roomsConnection;
	const rooms = roomsConnection.edges.map((edge) => edge.node);
	const { pageInfo } = roomsConnection;
	const hasNextPage = Boolean(pageInfo.hasNextPage && pageInfo.endCursor);
	const isLoadingMore = isFetchingMore || isPending;
	const loadMoreRooms = useCallback(() => {
		if (!(hasNextPage && pageInfo.endCursor) || isFetchingMore) {
			return;
		}

		setIsFetchingMore(true);
		startTransition(() => {
			fetchMore({
				variables: {
					after: pageInfo.endCursor,
					first: ROOM_PAGE_SIZE,
				},
			}).then(
				() => setIsFetchingMore(false),
				() => setIsFetchingMore(false)
			);
		});
	}, [fetchMore, hasNextPage, isFetchingMore, pageInfo.endCursor]);

	return (
		<div className="grid h-full min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[23rem_minmax(0,1fr)]">
			<div className="min-h-0 overflow-hidden border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<RoomList
					hasNextPage={hasNextPage}
					isLoadingMore={isLoadingMore}
					onLoadMore={loadMoreRooms}
					rooms={rooms}
				/>
			</div>
			<div className="min-h-0 overflow-hidden bg-background">
				<Outlet />
			</div>
		</div>
	);
}

function RoomsPlannerLayoutSkeleton() {
	return (
		<div className="grid h-full min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[23rem_minmax(0,1fr)]">
			<div className="min-h-0 overflow-hidden border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<aside className="flex h-full min-h-0 flex-col">
					<div className="border-b px-5 py-4">
						<Skeleton className="mb-2 h-3 w-20" />
						<Skeleton className="mb-2 h-7 w-28" />
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="flex-1 space-y-3 overflow-y-auto p-3">
						{ROOM_LIST_SKELETON_IDS.map((skeletonId) => {
							return (
								<Card className="gap-3 py-3" key={skeletonId} size="sm">
									<CardHeader className="gap-2">
										<div className="flex items-start justify-between gap-3">
											<CardTitle className="w-full">
												<Skeleton className="h-5 w-28" />
											</CardTitle>
											<Skeleton className="h-5 w-16 rounded-full" />
										</div>
									</CardHeader>
									<CardContent>
										<Skeleton className="h-8 w-full" />
									</CardContent>
								</Card>
							);
						})}
					</div>
				</aside>
			</div>
			<div className="min-h-0 overflow-hidden bg-background">
				<RoomDetail.Skeleton />
			</div>
		</div>
	);
}

function RoomsPlannerLayoutError({ error }: RoomsPlannerLayoutErrorProps) {
	const message =
		error instanceof Error && error.message.trim()
			? error.message
			: "Unable to load rooms right now.";

	return (
		<div className="grid h-full min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[23rem_minmax(0,1fr)]">
			<aside className="min-h-0 overflow-hidden border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<div className="border-b px-5 py-4">
					<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
						Houseplant Planner
					</p>
					<h1 className="font-heading text-xl">Rooms</h1>
				</div>
				<div className="p-4">
					<Card className="border border-border/80 border-dashed bg-muted/20">
						<CardHeader>
							<CardTitle>Room feed unavailable</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">
								The left rail could not load.
							</p>
						</CardContent>
					</Card>
				</div>
			</aside>
			<div className="flex min-h-0 items-center justify-center overflow-hidden p-6">
				<Card className="max-w-lg border border-border/80 border-dashed bg-muted/20">
					<CardHeader>
						<CardTitle>Unable to load the planner</CardTitle>
						<CardDescription>
							The room planner hit an error while loading data.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">{message}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

RoomsPlannerLayout.Skeleton = RoomsPlannerLayoutSkeleton;
RoomsPlannerLayout.Error = RoomsPlannerLayoutError;
