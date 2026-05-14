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
import { Pencil } from "lucide-react";
import { useState } from "react";

import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";

import { PlantForm, type PlantFormValues } from "./plant-form";
import {
	addOrReplacePlantEdgeInRoom,
	readRoomPlantCount,
	removePlantEdgeFromRoom,
} from "./room-cache";
import { UpdatePlantMutation } from "./room-operations";

export const PlantListItemFragment = graphql(/* GraphQL */ `
	fragment PlantListItem_plant on Plant {
		id
		roomId
		name
		species
	}
`);

interface PlantListItemProps {
	plant: FragmentType<typeof PlantListItemFragment>;
}

export function PlantListItem({ plant }: PlantListItemProps) {
	const apolloClient = useApolloClient();
	const [isEditing, setIsEditing] = useState(false);
	const { data } = useSuspenseFragment({
		fragment: PlantListItemFragment,
		from: plant,
	});
	const [updatePlant, { loading: isUpdatingPlant }] = useMutation(
		UpdatePlantMutation,
		{
			update(cache, { data: mutationData }) {
				const payload = mutationData?.updatePlant;

				if (!payload) {
					return;
				}

				if (
					payload.previousRoom &&
					payload.previousRoom.id !== payload.room.id
				) {
					removePlantEdgeFromRoom(
						cache,
						payload.previousRoom.id,
						payload.plant.id
					);
				}

				addOrReplacePlantEdgeInRoom(cache, payload.room.id, payload.plantEdge);
			},
		}
	);

	const handleUpdatePlant = async (values: PlantFormValues) => {
		const didMoveRooms = values.roomId !== data.roomId;
		const targetRoomPlantCount = readRoomPlantCount(
			apolloClient.cache,
			values.roomId
		);
		const previousRoomPlantCount = readRoomPlantCount(
			apolloClient.cache,
			data.roomId
		);

		await updatePlant({
			optimisticResponse: {
				__typename: "Mutation",
				updatePlant: {
					__typename: "UpdatePlantPayload",
					plant: {
						__typename: "Plant",
						id: data.id,
						name: values.name,
						roomId: values.roomId,
						species: values.species,
					},
					plantEdge: {
						__typename: "PlantEdge",
						cursor: `optimistic-plant-${data.id}`,
						node: {
							__typename: "Plant",
							id: data.id,
							name: values.name,
							roomId: values.roomId,
							species: values.species,
						},
					},
					previousRoom: didMoveRooms
						? {
								__typename: "Room",
								id: data.roomId,
								plantCount: Math.max(0, previousRoomPlantCount - 1),
							}
						: null,
					room: {
						__typename: "Room",
						id: values.roomId,
						plantCount: didMoveRooms
							? targetRoomPlantCount + 1
							: targetRoomPlantCount,
					},
				},
			},
			variables: {
				input: {
					id: data.id,
					name: values.name,
					roomId: values.roomId,
					species: values.species,
				},
			},
		});
		setIsEditing(false);
	};

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-1">
				<div className="flex items-start justify-between gap-3">
					<CardTitle className="text-base">{data.name}</CardTitle>
					<Button
						aria-label={`Edit ${data.name}`}
						onClick={() => setIsEditing((isOpen) => !isOpen)}
						size="icon-sm"
						variant="ghost"
					>
						<Pencil />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<PlantForm
						defaultValues={{
							name: data.name,
							roomId: data.roomId,
							species: data.species,
						}}
						isSubmitting={isUpdatingPlant}
						onCancel={() => setIsEditing(false)}
						onSubmit={(values) => handleUpdatePlant(values)}
						showRoomSelect
						submitLabel="Save plant"
					/>
				) : (
					<p className="text-muted-foreground text-sm">{data.species}</p>
				)}
			</CardContent>
		</Card>
	);
}
