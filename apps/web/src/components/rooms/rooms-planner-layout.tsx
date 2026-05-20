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
import {
	memo,
	Suspense,
	useCallback,
	useRef,
	useState,
	useTransition,
} from "react";
import { ErrorBoundary } from "react-error-boundary";

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
					...RoomTitle_room @nonreactive
					...RoomDescription_room @nonreactive
					...RoomForm_room @nonreactive
					...RoomPlantCountBadge_room @nonreactive
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

type RoomsPlannerQueryData = RoomsPlannerLayoutQueryQuery;
type RoomsPlannerConnection = RoomsPlannerQueryData["roomsConnection"];
type RoomsPlannerConnectionEdge = RoomsPlannerConnection["edges"][number];

const appendRoomsConnectionPage = (
	previousData: RoomsPlannerQueryData,
	fetchMoreData: RoomsPlannerQueryData | undefined
): RoomsPlannerQueryData => {
	if (!fetchMoreData) {
		return previousData;
	}

	const seenRoomIds = new Set<string>();
	const edges: RoomsPlannerConnectionEdge[] = [];

	for (const edge of previousData.roomsConnection.edges) {
		seenRoomIds.add(edge.node.id);
		edges.push(edge);
	}

	for (const edge of fetchMoreData.roomsConnection.edges) {
		if (seenRoomIds.has(edge.node.id)) {
			continue;
		}

		seenRoomIds.add(edge.node.id);
		edges.push(edge);
	}

	return {
		...previousData,
		roomsConnection: {
			...previousData.roomsConnection,
			edges,
			pageInfo: fetchMoreData.roomsConnection.pageInfo,
		},
	};
};

export function RoomsPlannerLayout() {
	return (
		<div className="grid h-full min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[23rem_minmax(0,1fr)]">
			<div className="min-h-0 overflow-hidden border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<ErrorBoundary FallbackComponent={RoomsRailError}>
					<Suspense fallback={<RoomsRailSkeleton />}>
						<RoomsRail />
					</Suspense>
				</ErrorBoundary>
			</div>
			<div className="min-h-0 overflow-hidden bg-background">
				<RoomOutlet />
			</div>
		</div>
	);
}

const RoomOutlet = memo(function RoomOutlet() {
	return <Outlet />;
});

function RoomsRail() {
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [isFetchMorePending, startFetchMoreTransition] = useTransition();
	const exhaustedCursorRef = useRef<string | null>(null);
	const pendingCursorRef = useRef<string | null>(null);
	const { data, fetchMore } = useSuspenseQuery(RoomsPlannerLayoutQuery, {
		variables: {
			first: ROOM_PAGE_SIZE,
		},
	});
	const roomsConnection = data.roomsConnection;
	const rooms = roomsConnection.edges.map((edge) => edge.node);
	const { pageInfo } = roomsConnection;
	const endCursor = pageInfo.endCursor ?? null;
	const isLoadingMore = isFetchingMore || isFetchMorePending;
	const hasNextPage = Boolean(
		pageInfo.hasNextPage &&
			endCursor &&
			exhaustedCursorRef.current !== endCursor
	);
	const loadMoreRooms = useCallback(() => {
		if (!(hasNextPage && endCursor) || pendingCursorRef.current === endCursor) {
			return;
		}

		pendingCursorRef.current = endCursor;
		setIsFetchingMore(true);
		startFetchMoreTransition(() => {
			fetchMore({
				updateQuery(previousData, { fetchMoreResult }) {
					return appendRoomsConnectionPage(previousData, fetchMoreResult);
				},
				variables: {
					after: endCursor,
					first: ROOM_PAGE_SIZE,
				},
			}).then(
				({ data: fetchMoreData }) => {
					if (!fetchMoreData) {
						exhaustedCursorRef.current = endCursor;
						pendingCursorRef.current = null;
						setIsFetchingMore(false);
						return;
					}

					const nextPageInfo = fetchMoreData.roomsConnection.pageInfo;
					const nextEndCursor = nextPageInfo.endCursor ?? null;

					if (
						fetchMoreData.roomsConnection.edges.length === 0 ||
						nextEndCursor === endCursor
					) {
						exhaustedCursorRef.current = endCursor;
					}

					pendingCursorRef.current = null;
					setIsFetchingMore(false);
				},
				() => {
					pendingCursorRef.current = null;
					setIsFetchingMore(false);
				}
			);
		});
	}, [endCursor, fetchMore, hasNextPage]);

	return (
		<RoomList
			hasNextPage={hasNextPage}
			isLoadingMore={isLoadingMore}
			onLoadMore={loadMoreRooms}
			rooms={rooms}
		/>
	);
}

function RoomsRailSkeleton() {
	return (
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
	);
}

function RoomsRailError({ error }: RoomsPlannerLayoutErrorProps) {
	const message =
		error instanceof Error && error.message.trim()
			? error.message
			: "Unable to load rooms right now.";

	return (
		<aside className="min-h-0 overflow-hidden">
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
						<p className="text-muted-foreground text-sm">{message}</p>
					</CardContent>
				</Card>
			</div>
		</aside>
	);
}

function RoomsPlannerLayoutSkeleton() {
	return (
		<div className="grid h-full min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[23rem_minmax(0,1fr)]">
			<div className="min-h-0 overflow-hidden border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<RoomsRailSkeleton />
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
