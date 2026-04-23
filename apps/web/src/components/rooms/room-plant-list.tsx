import { useSuspenseFragment } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { useParams } from "@tanstack/react-router";

import { graphql } from "@/__gql__";

import { PlantListItem } from "./plant-list-item";

export const RoomPlantListFragment = graphql(/* GraphQL */ `
	fragment RoomPlantList_room on Room {
		id
		plants {
			id
			...PlantListItem_plant
		}
	}
`);

export function RoomPlantList() {
	const { roomId } = useParams({ from: "/rooms/$roomId" });
	const { data } = useSuspenseFragment({
		fragment: RoomPlantListFragment,
		fragmentName: "RoomPlantList_room",
		from: {
			__typename: "Room",
			id: roomId,
		},
	});

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader>
				<CardTitle>Plants</CardTitle>
			</CardHeader>
			<CardContent>
				{data.plants.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						This room does not have any plants yet.
					</p>
				) : (
					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{data.plants.map((plant) => {
							return <PlantListItem key={plant.id} plant={plant} />;
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
