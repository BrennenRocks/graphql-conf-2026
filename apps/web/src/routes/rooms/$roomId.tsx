/* biome-ignore-all lint/style/useFilenamingConvention: TanStack Router dynamic segments use $param names */
import { createFileRoute } from "@tanstack/react-router";

import { RoomDetailShell } from "@/components/rooms/room-detail-shell";

export const Route = createFileRoute("/rooms/$roomId")({
	component: RoomDetailRoute,
});

function RoomDetailRoute() {
	return <RoomDetailShell />;
}
