import { type QueryRef, useReadQuery } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { Outlet } from "@tanstack/react-router";

import type { DocumentType } from "@/__gql__";
import { graphql } from "@/__gql__";
import { RoomDetail } from "@/routes/rooms/$roomId";
import { RoomList } from "./room-list";
import { RoomsPlannerProvider } from "./rooms-planner-context";

const ROOM_LIST_SKELETON_IDS = [
	"room-alpha",
	"room-bravo",
	"room-charlie",
	"room-delta",
] as const;

interface RoomsPlannerLayoutErrorProps {
	error: unknown;
	resetErrorBoundary?: () => void;
}

export const RoomsPlannerLayoutQuery = graphql(/* GraphQL */ `
	query RoomsPlannerLayoutQuery {
		rooms {
			id
			...RoomListItem_room
			...RoomHeader_room
			...RoomPlantList_room
		}
	}
`);

export type RoomsPlannerQueryRef = QueryRef<
	DocumentType<typeof RoomsPlannerLayoutQuery>
>;

interface RoomsPlannerLayoutProps {
	queryRef: RoomsPlannerQueryRef;
}

export function RoomsPlannerLayout({ queryRef }: RoomsPlannerLayoutProps) {
	const { data } = useReadQuery(queryRef);

	return (
		<RoomsPlannerProvider rooms={data.rooms}>
			<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[23rem_minmax(0,1fr)]">
				<div className="border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
					<RoomList />
				</div>
				<div className="min-h-0 bg-background">
					<Outlet />
				</div>
			</div>
		</RoomsPlannerProvider>
	);
}

function RoomsPlannerLayoutSkeleton() {
	return (
		<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[23rem_minmax(0,1fr)]">
			<div className="border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<aside className="flex h-full min-h-0 flex-col">
					<div className="border-b px-5 py-4">
						<Skeleton className="mb-2 h-3 w-20" />
						<Skeleton className="mb-2 h-7 w-28" />
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
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
			<div className="min-h-0 bg-background">
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
		<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[23rem_minmax(0,1fr)]">
			<aside className="border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
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
			<div className="flex items-center justify-center p-6">
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
