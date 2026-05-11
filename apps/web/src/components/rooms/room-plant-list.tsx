import { useLoadableQuery, useSuspenseQuery } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { useParams } from "@tanstack/react-router";
import {
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { graphql } from "@/__gql__";
import type { PlantCareNoteQueryQueryVariables } from "@/__gql__/graphql";
import { ErrorState } from "@/components/shared/error-state";

import {
	PlantCareNotePanel,
	PlantCareNoteQuery,
	type PlantCareNoteQueryRef,
} from "./plant-care-note-panel";
import { PlantListItem } from "./plant-list-item";

const PLANT_GRID_SKELETON_IDS = [
	"plant-skeleton-alpha",
	"plant-skeleton-bravo",
	"plant-skeleton-charlie",
] as const;

const PLANT_PAGE_SIZE = 24;

export const RoomPlantListQuery = graphql(/* GraphQL */ `
	query RoomPlantListQuery($roomId: ID!, $first: Int!, $after: String) {
		room(id: $roomId) {
			id
			plantsConnection(first: $first, after: $after) {
				edges {
					cursor
					node {
						id
						name
						...PlantListItem_plant
					}
				}
				pageInfo {
					endCursor
					hasNextPage
				}
			}
		}
	}
`);

type LoadPlantCareNote = (variables: PlantCareNoteQueryQueryVariables) => void;

export function RoomPlantList() {
	const [loadPlantCareNote, plantCareNoteQueryRef] =
		useLoadableQuery(PlantCareNoteQuery);

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader>
				<CardTitle>Plants</CardTitle>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<RoomPlantListPlantsSkeleton />}>
					<RoomPlantListPlants
						loadPlantCareNote={loadPlantCareNote}
						plantCareNoteQueryRef={plantCareNoteQueryRef}
					/>
				</Suspense>
			</CardContent>
		</Card>
	);
}

interface RoomPlantListPlantsProps {
	loadPlantCareNote: LoadPlantCareNote;
	plantCareNoteQueryRef: PlantCareNoteQueryRef | null;
}

function RoomPlantListPlants({
	loadPlantCareNote,
	plantCareNoteQueryRef,
}: RoomPlantListPlantsProps) {
	const { roomId } = useParams({ from: "/rooms/$roomId" });
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [isPending, startTransition] = useTransition();
	const loadMoreElementRef = useRef<HTMLDivElement | null>(null);
	const { data, fetchMore } = useSuspenseQuery(RoomPlantListQuery, {
		variables: {
			first: PLANT_PAGE_SIZE,
			roomId,
		},
	});
	const plantsConnection = data.room?.plantsConnection;
	const plants = plantsConnection?.edges.map((edge) => edge.node) ?? [];
	const pageInfo = plantsConnection?.pageInfo;
	const hasNextPage = Boolean(pageInfo?.hasNextPage && pageInfo.endCursor);
	const isLoadingMore = isFetchingMore || isPending;
	const loadMorePlants = useCallback(() => {
		if (!(hasNextPage && pageInfo?.endCursor) || isFetchingMore) {
			return;
		}

		setIsFetchingMore(true);
		startTransition(() => {
			fetchMore({
				variables: {
					after: pageInfo.endCursor,
					first: PLANT_PAGE_SIZE,
					roomId,
				},
			}).then(
				() => setIsFetchingMore(false),
				() => setIsFetchingMore(false)
			);
		});
	}, [fetchMore, hasNextPage, isFetchingMore, pageInfo?.endCursor, roomId]);

	useEffect(() => {
		const loadMoreElement = loadMoreElementRef.current;

		if (!(hasNextPage && loadMoreElement)) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					loadMorePlants();
				}
			},
			{
				rootMargin: "240px 0px",
			}
		);

		observer.observe(loadMoreElement);

		return () => observer.disconnect();
	}, [hasNextPage, loadMorePlants]);

	if (!data.room) {
		return (
			<p className="text-muted-foreground text-sm">
				This room could not be found.
			</p>
		);
	}

	if (plants.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				This room does not have any plants yet.
			</p>
		);
	}

	return (
		<>
			<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
				{plants.map((plant) => {
					return <PlantListItem key={plant.id} plant={plant} />;
				})}
			</div>
			{hasNextPage ? (
				<div className="mt-4 flex justify-center" ref={loadMoreElementRef}>
					<Button
						disabled={isLoadingMore}
						onClick={loadMorePlants}
						size="sm"
						variant="outline"
					>
						{isLoadingMore ? "Loading plants..." : "Load more plants"}
					</Button>
				</div>
			) : null}
			<div className="mt-5 space-y-3 border-t pt-4">
				<div className="flex flex-wrap gap-2">
					{plants.map((plant) => {
						return (
							<Button
								key={plant.id}
								onClick={() => loadPlantCareNote({ id: plant.id })}
								size="sm"
								variant="outline"
							>
								Care note for {plant.name}
							</Button>
						);
					})}
				</div>
				<ErrorBoundary FallbackComponent={PlantCareNotePanel.Error}>
					<Suspense fallback={<PlantCareNotePanel.Skeleton />}>
						{plantCareNoteQueryRef ? (
							<PlantCareNotePanel queryRef={plantCareNoteQueryRef} />
						) : null}
					</Suspense>
				</ErrorBoundary>
			</div>
		</>
	);
}

function RoomPlantListPlantsSkeleton() {
	return (
		<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
			{PLANT_GRID_SKELETON_IDS.map((skeletonId) => {
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
		</div>
	);
}

function RoomPlantListSkeleton() {
	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader>
				<Skeleton className="h-6 w-20" />
			</CardHeader>
			<CardContent>
				<RoomPlantListPlantsSkeleton />
			</CardContent>
		</Card>
	);
}

function RoomPlantListError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="Failed to load plants"
		/>
	);
}

RoomPlantList.Skeleton = RoomPlantListSkeleton;
RoomPlantList.Error = RoomPlantListError;
