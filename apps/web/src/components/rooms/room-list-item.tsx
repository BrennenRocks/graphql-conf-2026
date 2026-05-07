import { useSuspenseFragment } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Link } from "@tanstack/react-router";

import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";
import { cn } from "@/lib/utils";

export const RoomListItemFragment = graphql(/* GraphQL */ `
	fragment RoomListItem_room on Room {
		id
		name
		description
		plantCount
	}
`);

interface RoomListItemProps {
	isActive: boolean;
	room: FragmentType<typeof RoomListItemFragment>;
}

export function RoomListItem({ isActive, room }: RoomListItemProps) {
	const { data } = useSuspenseFragment({
		fragment: RoomListItemFragment,
		from: room,
	});

	return (
		<Link params={{ roomId: data.id }} preload="intent" to="/rooms/$roomId">
			<Card
				className={cn(
					"gap-3 border border-border/70 bg-card/80 py-3 transition-colors hover:border-primary/40 hover:bg-accent/30",
					isActive && "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
				)}
				size="sm"
			>
				<CardHeader className="gap-2">
					<div className="flex items-start justify-between gap-3">
						<CardTitle className="text-base">{data.name}</CardTitle>
						<div className="rounded-full border border-border/80 bg-background/80 px-2 py-1 font-medium text-[0.7rem]">
							{data.plantCount} plants
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">{data.description}</p>
				</CardContent>
			</Card>
		</Link>
	);
}
