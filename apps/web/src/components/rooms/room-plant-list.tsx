import { useLoadableQuery, useSuspenseFragment } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { useParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { graphql } from "@/__gql__";

import {
	PlantCareNotePanel,
	PlantCareNoteQuery,
} from "./plant-care-note-panel";
import { PlantListItem } from "./plant-list-item";

export const RoomPlantListFragment = graphql(/* GraphQL */ `
	fragment RoomPlantList_room on Room {
		id
		plants {
			id
			name
			...PlantListItem_plant
		}
	}
`);

export function RoomPlantList() {
	const { roomId } = useParams({ from: "/rooms/$roomId" });
	const [loadPlantCareNote, plantCareNoteQueryRef] =
		useLoadableQuery(PlantCareNoteQuery);
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
				{data.plants.length > 0 ? (
					<div className="mt-5 space-y-3 border-t pt-4">
						<div className="flex flex-wrap gap-2">
							{data.plants.map((plant) => {
								return (
									<Button
										key={plant.id}
										onClick={() => loadPlantCareNote({ id: plant.id })}
										size="sm"
										variant="outline"
									>
										Care note for {plant.name}
									</Button>
								);
							})}
						</div>
						<ErrorBoundary FallbackComponent={PlantCareNotePanel.Error}>
							<Suspense fallback={<PlantCareNotePanel.Skeleton />}>
								{plantCareNoteQueryRef ? (
									<PlantCareNotePanel queryRef={plantCareNoteQueryRef} />
								) : null}
							</Suspense>
						</ErrorBoundary>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
