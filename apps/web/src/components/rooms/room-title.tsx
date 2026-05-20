import { useSuspenseFragment } from "@apollo/client/react";
import { CardTitle } from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { graphql } from "@/__gql__";

export const RoomTitleFragment = graphql(/* GraphQL */ `
	fragment RoomTitle_room on Room {
		name
	}
`);

interface RoomTitleProps {
	className?: string;
	id?: string;
	roomId: string;
}

export function RoomTitle({ className, id, roomId }: RoomTitleProps) {
	const { data } = useSuspenseFragment({
		fragment: RoomTitleFragment,
		from: {
			__typename: "Room",
			id: roomId,
		},
	});

	return (
		<CardTitle className={className} id={id}>
			{data.name}
		</CardTitle>
	);
}

function RoomTitleSkeleton({ className }: Pick<RoomTitleProps, "className">) {
	return <Skeleton className={className ?? "h-7 w-48"} />;
}

RoomTitle.Skeleton = RoomTitleSkeleton;
