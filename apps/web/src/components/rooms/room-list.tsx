import { Button } from "@graphql-conf/ui/components/button";
import { useRouterState } from "@tanstack/react-router";
import type { UIEvent } from "react";
import { RoomListEmptyState } from "./room-list-empty-state";
import { RoomListItem } from "./room-list-item";
import type { RoomsPlannerRoom } from "./rooms-planner-layout";

const SCROLL_LOAD_THRESHOLD_PX = 160;

const getSelectedRoomId = (state: {
	matches: Array<{
		params: Record<string, unknown>;
		routeId: string;
	}>;
}) => {
	const roomMatch = state.matches.find((match) => {
		return match.routeId === "/rooms/$roomId";
	});

	const roomId = roomMatch?.params.roomId;

	return typeof roomId === "string" ? roomId : undefined;
};

interface RoomListProps {
	hasNextPage: boolean;
	isLoadingMore: boolean;
	onLoadMore: () => void;
	rooms: RoomsPlannerRoom[];
}

export function RoomList({
	hasNextPage,
	isLoadingMore,
	onLoadMore,
	rooms,
}: RoomListProps) {
	const selectedRoomId = useRouterState({
		select: getSelectedRoomId,
	});

	const handleScroll = (event: UIEvent<HTMLElement>) => {
		if (!(hasNextPage && !isLoadingMore)) {
			return;
		}

		const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

		if (distanceFromBottom <= SCROLL_LOAD_THRESHOLD_PX) {
			onLoadMore();
		}
	};

	return (
		<aside className="flex h-full min-h-0 flex-col">
			<div className="shrink-0 border-b px-5 py-4">
				<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
					Houseplant Planner
				</p>
				<h1 className="font-heading text-xl">Rooms</h1>
				<p className="text-muted-foreground text-sm">
					Choose a room to inspect the plants inside it.
				</p>
			</div>
			{rooms.length === 0 ? (
				<RoomListEmptyState />
			) : (
				<nav
					aria-label="Room list"
					className="min-h-0 flex-1 overflow-y-auto p-3"
					onScroll={handleScroll}
				>
					<div className="grid gap-3">
						{rooms.map((room) => {
							return (
								<RoomListItem
									isActive={room.id === selectedRoomId}
									key={room.id}
									room={room}
								/>
							);
						})}
						{hasNextPage ? (
							<div className="flex justify-center">
								<Button
									disabled={isLoadingMore}
									onClick={onLoadMore}
									size="sm"
									variant="outline"
								>
									{isLoadingMore ? "Loading rooms..." : "Load more rooms"}
								</Button>
							</div>
						) : null}
					</div>
				</nav>
			)}
		</aside>
	);
}
