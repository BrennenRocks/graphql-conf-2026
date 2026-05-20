import { useSuspenseFragment } from "@apollo/client/react";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { graphql } from "@/__gql__";

export const RoomDescriptionFragment = graphql(/* GraphQL */ `
	fragment RoomDescription_room on Room {
		description
	}
`);

interface RoomDescriptionProps {
	className?: string;
	roomId: string;
}

export function RoomDescription({ className, roomId }: RoomDescriptionProps) {
	const { data } = useSuspenseFragment({
		fragment: RoomDescriptionFragment,
		from: {
			__typename: "Room",
			id: roomId,
		},
	});

	return <p className={className}>{data.description}</p>;
}

function RoomDescriptionSkeleton({
	className,
}: Pick<RoomDescriptionProps, "className">) {
	return <Skeleton className={className ?? "h-4 w-72 max-w-full"} />;
}

RoomDescription.Skeleton = RoomDescriptionSkeleton;
