import { useSuspenseFragment } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { useParams } from "@tanstack/react-router";

import { graphql } from "@/__gql__";

export const RoomHeaderFragment = graphql(/* GraphQL */ `
	fragment RoomHeader_room on Room {
		id
		name
		description
		plantCount
	}
`);

export function RoomHeader() {
	const { roomId } = useParams({ from: "/rooms/$roomId" });
	const { data } = useSuspenseFragment({
		fragment: RoomHeaderFragment,
		fragmentName: "RoomHeader_room",
		from: {
			__typename: "Room",
			id: roomId,
		},
	});

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-3">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="space-y-2">
						<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
							Plant Room
						</p>
						<CardTitle className="text-2xl">{data.name}</CardTitle>
						<p className="max-w-2xl text-muted-foreground text-sm">
							{data.description}
						</p>
					</div>
					<div className="rounded-full border border-border/80 bg-background/80 px-3 py-1 font-medium text-xs">
						{data.plantCount} plants
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
