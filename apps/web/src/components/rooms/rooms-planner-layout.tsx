import { type QueryRef, useReadQuery } from "@apollo/client/react";
import { Outlet } from "@tanstack/react-router";

import type { DocumentType } from "@/__gql__";
import { graphql } from "@/__gql__";

import { RoomList } from "./room-list";
import { RoomsPlannerProvider } from "./rooms-planner-context";

export const RoomsPlannerLayoutQuery = graphql(/* GraphQL */ `
	query RoomsPlannerLayoutQuery {
		rooms {
			id
			...RoomListItem_room
			...RoomHeader_room
			...RoomPlantList_room
		}
	}
`);

export type RoomsPlannerQueryRef = QueryRef<
	DocumentType<typeof RoomsPlannerLayoutQuery>
>;

interface RoomsPlannerLayoutProps {
	queryRef: RoomsPlannerQueryRef;
}

export function RoomsPlannerLayout({ queryRef }: RoomsPlannerLayoutProps) {
	const { data } = useReadQuery(queryRef);

	return (
		<RoomsPlannerProvider rooms={data.rooms}>
			<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[23rem_minmax(0,1fr)]">
				<div className="border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
					<RoomList />
				</div>
				<div className="min-h-0 bg-background">
					<Outlet />
				</div>
			</div>
		</RoomsPlannerProvider>
	);
}
