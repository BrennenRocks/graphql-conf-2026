import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
} from "@graphql-conf/ui/components/card";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { memo, Suspense, useId, useState } from "react";

import { cn } from "@/lib/utils";
import { RoomDescription } from "./room-description";
import { RoomForm } from "./room-form";
import { RoomPlantCountBadge } from "./room-plant-count-badge";
import { RoomTitle } from "./room-title";
import { useUpdateRoom } from "./use-update-room";

interface RoomListItemProps {
	isActive: boolean;
	roomId: string;
}

export const RoomListItem = memo(function RoomListItem({
	isActive,
	roomId,
}: RoomListItemProps) {
	const titleId = useId();
	const editLabelId = useId();
	const [isEditing, setIsEditing] = useState(false);
	const [updateRoom, { loading: isUpdatingRoom }] = useUpdateRoom();

	const handleUpdateRoom = async (values: {
		description: string;
		name: string;
	}) => {
		await updateRoom({
			variables: {
				input: {
					description: values.description,
					id: roomId,
					name: values.name,
				},
			},
		});
		setIsEditing(false);
	};

	return (
		<Card
			className={cn(
				"gap-3 border border-border/70 bg-card/80 py-3 transition-colors hover:border-primary/40 hover:bg-accent/30",
				isActive && "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
			)}
			size="sm"
		>
			<CardHeader className="gap-2">
				<div className="flex items-start justify-between gap-3">
					<Link params={{ roomId }} preload="intent" to="/rooms/$roomId">
						<RoomTitle className="text-base" id={titleId} roomId={roomId} />
					</Link>
					<div className="flex items-center gap-2">
						<Suspense fallback={<RoomPlantCountBadge.Skeleton size="sm" />}>
							<RoomPlantCountBadge roomId={roomId} size="sm" />
						</Suspense>
						<Button
							aria-labelledby={`${editLabelId} ${titleId}`}
							onClick={() => setIsEditing((isOpen) => !isOpen)}
							size="icon-sm"
							variant="ghost"
						>
							<span className="sr-only" id={editLabelId}>
								Edit
							</span>
							<Pencil />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<RoomForm
						isSubmitting={isUpdatingRoom}
						onCancel={() => setIsEditing(false)}
						onSubmit={(values) => handleUpdateRoom(values)}
						roomId={roomId}
						submitLabel="Save room"
					/>
				) : (
					<Link params={{ roomId }} preload="intent" to="/rooms/$roomId">
						<RoomDescription
							className="text-muted-foreground text-sm"
							roomId={roomId}
						/>
					</Link>
				)}
			</CardContent>
		</Card>
	);
}, areRoomListItemPropsEqual);

function areRoomListItemPropsEqual(
	previousProps: RoomListItemProps,
	nextProps: RoomListItemProps
) {
	return (
		previousProps.isActive === nextProps.isActive &&
		previousProps.roomId === nextProps.roomId
	);
}
