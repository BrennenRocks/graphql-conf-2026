import { type QueryRef, useReadQuery } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import type { FallbackProps } from "react-error-boundary";

import type { DocumentType } from "@/__gql__";
import { graphql } from "@/__gql__";
import { ErrorState } from "@/components/shared/error-state";

export const RoomCarePlanQuery = graphql(/* GraphQL */ `
	query RoomCarePlanQuery($id: ID!) {
		roomCarePlan(id: $id) {
			roomId
			summary
			tips
		}
	}
`);

interface RoomCarePlanPanelProps {
	queryRef: QueryRef<DocumentType<typeof RoomCarePlanQuery>>;
}

export function RoomCarePlanPanel({ queryRef }: RoomCarePlanPanelProps) {
	const { data } = useReadQuery(queryRef);
	const { roomCarePlan } = data;

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader>
				<CardTitle>Care Plan</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<p className="text-muted-foreground text-sm">{roomCarePlan.summary}</p>
				<ul className="grid gap-2 text-sm">
					{roomCarePlan.tips.map((tip) => {
						return (
							<li
								className="rounded-md border bg-background/60 px-3 py-2"
								key={tip}
							>
								{tip}
							</li>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}

function RoomCarePlanPanelSkeleton() {
	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader>
				<Skeleton className="h-6 w-24" />
			</CardHeader>
			<CardContent className="space-y-3">
				<Skeleton className="h-4 w-72 max-w-full" />
				<Skeleton className="h-9 w-full" />
				<Skeleton className="h-9 w-full" />
			</CardContent>
		</Card>
	);
}

function RoomCarePlanPanelError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="Failed to load care plan"
		/>
	);
}

RoomCarePlanPanel.Skeleton = RoomCarePlanPanelSkeleton;
RoomCarePlanPanel.Error = RoomCarePlanPanelError;
