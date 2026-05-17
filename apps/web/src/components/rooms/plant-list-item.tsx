import { useSuspenseFragment } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";

import { PlantForm, type PlantFormValues } from "./plant-form";
import { useDeletePlant } from "./use-delete-plant";
import { useUpdatePlant } from "./use-update-plant";

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
	const [isEditing, setIsEditing] = useState(false);
	const { data } = useSuspenseFragment({
		fragment: PlantListItemFragment,
		from: plant,
	});
	const [updatePlant, { loading: isUpdatingPlant }] = useUpdatePlant();
	const [deletePlant, { loading: isDeletingPlant }] = useDeletePlant();

	const handleUpdatePlant = async (values: PlantFormValues) => {
		await updatePlant({
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

	const handleDeletePlant = async () => {
		await deletePlant({
			variables: {
				input: {
					id: data.id,
				},
			},
		});
	};

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-1">
				<div className="flex items-start justify-between gap-3">
					<CardTitle className="text-base">{data.name}</CardTitle>
					<div className="flex items-center gap-1">
						<Button
							aria-label={`Edit ${data.name}`}
							disabled={isDeletingPlant}
							onClick={() => setIsEditing((isOpen) => !isOpen)}
							size="icon-sm"
							variant="ghost"
						>
							<Pencil />
						</Button>
						<Button
							aria-label={`Delete ${data.name}`}
							disabled={isDeletingPlant}
							onClick={handleDeletePlant}
							size="icon-sm"
							variant="destructive"
						>
							<Trash2 />
						</Button>
					</div>
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
