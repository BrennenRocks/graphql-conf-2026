import { useSuspenseFragment } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import type { FallbackProps } from "react-error-boundary";

import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";
import { ErrorState } from "@/components/shared/error-state";

export const RoomHeaderFragment = graphql(/* GraphQL */ `
	fragment RoomHeader_room on Room {
		id
		name
		description
		plantCount
	}
`);

interface RoomHeaderProps {
	room: FragmentType<typeof RoomHeaderFragment>;
}

export function RoomHeader({ room }: RoomHeaderProps) {
	const { data } = useSuspenseFragment({
		fragment: RoomHeaderFragment,
		from: room,
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

function RoomHeaderSkeleton() {
	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-3">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="space-y-2">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-7 w-48" />
						<Skeleton className="h-4 w-72 max-w-full" />
					</div>
					<Skeleton className="h-6 w-20 rounded-full" />
				</div>
			</CardHeader>
			<CardContent>
				<Skeleton className="h-3 w-28" />
			</CardContent>
		</Card>
	);
}

function RoomHeaderError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="Failed to load room"
		/>
	);
}

RoomHeader.Skeleton = RoomHeaderSkeleton;
RoomHeader.Error = RoomHeaderError;
