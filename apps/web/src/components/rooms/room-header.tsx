import {
	useApolloClient,
	useMutation,
	useSuspenseFragment,
} from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { Pencil } from "lucide-react";
import { Suspense, useState } from "react";
import type { FallbackProps } from "react-error-boundary";

import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";
import { ErrorState } from "@/components/shared/error-state";
import { readRoomPlantCount } from "./room-cache";
import { RoomForm } from "./room-form";
import { UpdateRoomMutation } from "./room-operations";
import {
	RoomPlantCountBadge,
	RoomPlantCountBadgeSkeleton,
} from "./room-plant-count-badge";

export const RoomHeaderFragment = graphql(/* GraphQL */ `
	fragment RoomHeader_room on Room {
		id
		name
		description
	}
`);

interface RoomHeaderProps {
	room: FragmentType<typeof RoomHeaderFragment>;
}

export function RoomHeader({ room }: RoomHeaderProps) {
	const apolloClient = useApolloClient();
	const [isEditing, setIsEditing] = useState(false);
	const { data } = useSuspenseFragment({
		fragment: RoomHeaderFragment,
		from: room,
	});
	const [updateRoom, { loading: isUpdatingRoom }] =
		useMutation(UpdateRoomMutation);

	const handleUpdateRoom = async (values: {
		description: string;
		name: string;
	}) => {
		const plantCount = readRoomPlantCount(apolloClient.cache, data.id);

		await updateRoom({
			optimisticResponse: {
				__typename: "Mutation",
				updateRoom: {
					__typename: "UpdateRoomPayload",
					room: {
						__typename: "Room",
						description: values.description,
						id: data.id,
						name: values.name,
						plantCount,
					},
					roomEdge: {
						__typename: "RoomEdge",
						cursor: `optimistic-room-${data.id}`,
						node: {
							__typename: "Room",
							description: values.description,
							id: data.id,
							name: values.name,
							plantCount,
						},
					},
				},
			},
			variables: {
				input: {
					description: values.description,
					id: data.id,
					name: values.name,
				},
			},
		});
		setIsEditing(false);
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
							<div className="w-full min-w-[min(20rem,100%)] max-w-xl rounded-md border border-border/80 bg-background/70 p-3">
								<RoomForm
									defaultValues={{
										description: data.description,
										name: data.name,
									}}
									isSubmitting={isUpdatingRoom}
									onCancel={() => setIsEditing(false)}
									onSubmit={(values) => handleUpdateRoom(values)}
									submitLabel="Save room"
								/>
							</div>
						) : (
							<>
								<CardTitle className="text-2xl">{data.name}</CardTitle>
								<p className="max-w-2xl text-muted-foreground text-sm">
									{data.description}
								</p>
							</>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Suspense fallback={<RoomPlantCountBadgeSkeleton />}>
							<RoomPlantCountBadge roomId={data.id} />
						</Suspense>
						<Button
							aria-label={`Edit ${data.name}`}
							onClick={() => setIsEditing((isOpen) => !isOpen)}
							size="icon"
							variant="outline"
						>
							<Pencil />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
					Room Overview
				</p>
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
				<Skeleton className="h-3 w-28" />
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
