import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import { Suspense, useId, useState } from "react";
import type { FallbackProps } from "react-error-boundary";

import { ErrorState } from "@/components/shared/error-state";
import { RoomDescription } from "./room-description";
import { RoomForm } from "./room-form";
import { RoomLightProfile } from "./room-light-profile";
import { RoomPlantCountBadge } from "./room-plant-count-badge";
import { RoomTitle } from "./room-title";
import { useDeleteRoom } from "./use-delete-room";
import { useUpdateRoom } from "./use-update-room";

interface RoomHeaderProps {
	roomId: string;
}

export function RoomHeader({ roomId }: RoomHeaderProps) {
	const titleId = useId();
	const editLabelId = useId();
	const deleteLabelId = useId();
	const [isEditing, setIsEditing] = useState(false);
	const [updateRoom, { loading: isUpdatingRoom }] = useUpdateRoom();
	const [deleteRoom, { loading: isDeletingRoom }] = useDeleteRoom();

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

	const handleDeleteRoom = async () => {
		await deleteRoom({
			variables: {
				input: {
					id: roomId,
				},
			},
		});
	};

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-3">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="space-y-2">
						<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
							Plant Room
						</p>
						{isEditing ? (
							<>
								<RoomTitle className="sr-only" id={titleId} roomId={roomId} />
								<div className="w-full min-w-[min(20rem,100%)] max-w-xl rounded-md border border-border/80 bg-background/70 p-3">
									<RoomForm
										isSubmitting={isUpdatingRoom}
										onCancel={() => setIsEditing(false)}
										onSubmit={(values) => handleUpdateRoom(values)}
										roomId={roomId}
										submitLabel="Save room"
									/>
								</div>
							</>
						) : (
							<>
								<RoomTitle className="text-2xl" id={titleId} roomId={roomId} />
								<RoomDescription
									className="max-w-2xl text-muted-foreground text-sm"
									roomId={roomId}
								/>
							</>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Suspense fallback={<RoomPlantCountBadge.Skeleton />}>
							<RoomPlantCountBadge roomId={roomId} />
						</Suspense>
						<Button
							aria-labelledby={`${editLabelId} ${titleId}`}
							disabled={isDeletingRoom}
							onClick={() => setIsEditing((isOpen) => !isOpen)}
							size="icon"
							variant="outline"
						>
							<span className="sr-only" id={editLabelId}>
								Edit
							</span>
							<Pencil />
						</Button>
						<Button
							aria-labelledby={`${deleteLabelId} ${titleId}`}
							disabled={isDeletingRoom}
							onClick={handleDeleteRoom}
							size="icon"
							variant="destructive"
						>
							<span className="sr-only" id={deleteLabelId}>
								Delete
							</span>
							<Trash2 />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<RoomLightProfile.Skeleton />}>
					<RoomLightProfile roomId={roomId} />
				</Suspense>
			</CardContent>
		</Card>
	);
}

function RoomHeaderSkeleton() {
	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-3">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="space-y-2">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-7 w-48" />
						<Skeleton className="h-4 w-72 max-w-full" />
					</div>
					<Skeleton className="h-6 w-20 rounded-full" />
				</div>
			</CardHeader>
			<CardContent>
				<RoomLightProfile.Skeleton />
			</CardContent>
		</Card>
	);
}

function RoomHeaderError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="Failed to load room"
		/>
	);
}

RoomHeader.Skeleton = RoomHeaderSkeleton;
RoomHeader.Error = RoomHeaderError;
