import { createFileRoute } from "@tanstack/react-router";

import { RoomEmptySelection } from "@/components/rooms/room-empty-selection";

export const Route = createFileRoute("/rooms/")({
	component: RoomsIndexRoute,
});

function RoomsIndexRoute() {
	return <RoomEmptySelection />;
}
