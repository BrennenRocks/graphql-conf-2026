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
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { Suspense, useState } from "react";

import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";
import { cn } from "@/lib/utils";

import { readRoomPlantCount } from "./room-cache";
import { RoomForm } from "./room-form";
import { UpdateRoomMutation } from "./room-operations";
import {
	RoomPlantCountBadge,
	RoomPlantCountBadgeSkeleton,
} from "./room-plant-count-badge";

export const RoomListItemFragment = graphql(/* GraphQL */ `
	fragment RoomListItem_room on Room {
		id
		name
		description
	}
`);

interface RoomListItemProps {
	isActive: boolean;
	room: FragmentType<typeof RoomListItemFragment>;
}

export function RoomListItem({ isActive, room }: RoomListItemProps) {
	const apolloClient = useApolloClient();
	const [isEditing, setIsEditing] = useState(false);
	const { data } = useSuspenseFragment({
		fragment: RoomListItemFragment,
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
		<Card
			className={cn(
				"gap-3 border border-border/70 bg-card/80 py-3 transition-colors hover:border-primary/40 hover:bg-accent/30",
				isActive && "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
			)}
			size="sm"
		>
			<CardHeader className="gap-2">
				<div className="flex items-start justify-between gap-3">
					<Link
						params={{ roomId: data.id }}
						preload="intent"
						to="/rooms/$roomId"
					>
						<CardTitle className="text-base">{data.name}</CardTitle>
					</Link>
					<div className="flex items-center gap-2">
						<Suspense fallback={<RoomPlantCountBadgeSkeleton size="sm" />}>
							<RoomPlantCountBadge roomId={data.id} size="sm" />
						</Suspense>
						<Button
							aria-label={`Edit ${data.name}`}
							onClick={() => setIsEditing((isOpen) => !isOpen)}
							size="icon-sm"
							variant="ghost"
						>
							<Pencil />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isEditing ? (
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
				) : (
					<Link
						params={{ roomId: data.id }}
						preload="intent"
						to="/rooms/$roomId"
					>
						<p className="text-muted-foreground text-sm">{data.description}</p>
					</Link>
				)}
			</CardContent>
		</Card>
	);
}
