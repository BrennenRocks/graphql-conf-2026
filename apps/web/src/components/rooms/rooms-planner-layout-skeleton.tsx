import { RoomDetailShellSkeleton } from "./room-detail-shell-skeleton";
import { RoomListSkeleton } from "./room-list-skeleton";

export function RoomsPlannerLayoutSkeleton() {
	return (
		<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[23rem_minmax(0,1fr)]">
			<div className="border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<RoomListSkeleton />
			</div>
			<div className="min-h-0 bg-background">
				<RoomDetailShellSkeleton />
			</div>
		</div>
	);
}
