import { useParams } from "@tanstack/react-router";

import { RoomHeader } from "./room-header";
import { RoomNotFound } from "./room-not-found";
import { RoomPlantList } from "./room-plant-list";
import { useRoomsPlannerContext } from "./rooms-planner-context";

export function RoomDetailShell() {
	const { roomId } = useParams({ from: "/rooms/$roomId" });
	const { rooms } = useRoomsPlannerContext();
	const hasRoom = rooms.some((room) => {
		return room.id === roomId;
	});

	if (!hasRoom) {
		return <RoomNotFound />;
	}

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<RoomHeader />
			<RoomPlantList />
		</div>
	);
}
