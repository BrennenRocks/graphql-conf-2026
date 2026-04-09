import { type QueryRef, useReadQuery } from "@apollo/client/react";
import { Outlet } from "@tanstack/react-router";

import type { DocumentType } from "@/__gql__";
import { graphql } from "@/__gql__";

import { MissionList } from "./mission-list";
import { MissionPlannerProvider } from "./mission-planner-context";

export const MissionPlannerLayoutQuery = graphql(/* GraphQL */ `
	query MissionPlannerLayoutQuery {
		missions {
			id
			...MissionListItem_mission
			...MissionShellHeader_mission
		}
	}
`);

export type MissionPlannerQueryRef = QueryRef<
	DocumentType<typeof MissionPlannerLayoutQuery>
>;

interface MissionPlannerLayoutProps {
	queryRef: MissionPlannerQueryRef;
}

export function MissionPlannerLayout({ queryRef }: MissionPlannerLayoutProps) {
	const { data } = useReadQuery(queryRef);

	return (
		<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[23rem_minmax(0,1fr)]">
			<div className="border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<MissionList missions={data.missions} />
			</div>
			<div className="min-h-0 bg-background">
				<MissionPlannerProvider missions={data.missions}>
					<Outlet />
				</MissionPlannerProvider>
			</div>
		</div>
	);
}
