import { useRouterState } from "@tanstack/react-router";

import { RoomListEmptyState } from "./room-list-empty-state";
import { RoomListItem } from "./room-list-item";
import { useRoomsPlannerContext } from "./rooms-planner-context";

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

export function RoomList() {
	const { rooms } = useRoomsPlannerContext();
	const selectedRoomId = useRouterState({
		select: getSelectedRoomId,
	});

	return (
		<aside className="flex h-full min-h-0 flex-col">
			<div className="border-b px-5 py-4">
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
					className="flex-1 overflow-y-auto px-3 py-3"
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
					</div>
				</nav>
			)}
		</aside>
	);
}
