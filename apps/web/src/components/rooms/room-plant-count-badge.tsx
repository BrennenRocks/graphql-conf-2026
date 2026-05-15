import { useSuspenseFragment } from "@apollo/client/react";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";

import { graphql } from "@/__gql__";
import { cn } from "@/lib/utils";

export const RoomPlantCountBadgeFragment = graphql(/* GraphQL */ `
	fragment RoomPlantCountBadge_room on Room {
		plantCount
	}
`);

interface RoomPlantCountBadgeProps {
	roomId: string;
	size?: "sm" | "md";
}

export function RoomPlantCountBadge({
	roomId,
	size = "md",
}: RoomPlantCountBadgeProps) {
	const { data } = useSuspenseFragment({
		fragment: RoomPlantCountBadgeFragment,
		from: {
			__typename: "Room",
			id: roomId,
		},
	});

	return (
		<div
			className={cn(
				"rounded-full border border-border/80 bg-background/80 font-medium",
				size === "sm" ? "px-2 py-1 text-[0.7rem]" : "px-3 py-1 text-xs"
			)}
		>
			{data.plantCount} plants
		</div>
	);
}

export function RoomPlantCountBadgeSkeleton({
	size = "md",
}: Pick<RoomPlantCountBadgeProps, "size">) {
	return (
		<Skeleton
			className={cn("rounded-full", size === "sm" ? "h-6 w-16" : "h-6 w-20")}
		/>
	);
}
