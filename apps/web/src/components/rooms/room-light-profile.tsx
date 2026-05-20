import { useSuspenseFragment } from "@apollo/client/react";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";

import { graphql } from "@/__gql__";

export const RoomLightProfileFragment = graphql(/* GraphQL */ `
	fragment RoomLightProfile_room on Room {
		lightProfile
	}
`);

interface RoomLightProfileProps {
	roomId: string;
}

export function RoomLightProfile({ roomId }: RoomLightProfileProps) {
	const { data } = useSuspenseFragment({
		fragment: RoomLightProfileFragment,
		from: {
			__typename: "Room",
			id: roomId,
		},
	});

	return (
		<p className="text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
			{data.lightProfile}
		</p>
	);
}

function RoomLightProfileSkeleton() {
	return <Skeleton className="h-3 w-28" />;
}

RoomLightProfile.Skeleton = RoomLightProfileSkeleton;
