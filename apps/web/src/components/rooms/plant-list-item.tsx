import { useSuspenseFragment } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";

import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";

export const PlantListItemFragment = graphql(/* GraphQL */ `
	fragment PlantListItem_plant on Plant {
		id
		name
		species
	}
`);

interface PlantListItemProps {
	plant: FragmentType<typeof PlantListItemFragment>;
}

export function PlantListItem({ plant }: PlantListItemProps) {
	const { data } = useSuspenseFragment({
		fragment: PlantListItemFragment,
		from: plant,
	});

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-1">
				<CardTitle className="text-base">{data.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm">{data.species}</p>
			</CardContent>
		</Card>
	);
}
