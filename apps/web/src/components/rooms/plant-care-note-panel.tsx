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

export const PlantCareNoteQuery = graphql(/* GraphQL */ `
	query PlantCareNoteQuery($id: ID!) {
		plantCareNote(id: $id) {
			id
			name
			species
			note
		}
	}
`);

export type PlantCareNoteQueryRef = QueryRef<
	DocumentType<typeof PlantCareNoteQuery>
>;

interface PlantCareNotePanelProps {
	queryRef: PlantCareNoteQueryRef;
}

export function PlantCareNotePanel({ queryRef }: PlantCareNotePanelProps) {
	const { data } = useReadQuery(queryRef);
	const { plantCareNote } = data;

	return (
		<Card className="border border-border/80 bg-background/60">
			<CardHeader className="gap-1">
				<CardTitle className="text-base">{plantCareNote.name}</CardTitle>
				<p className="text-muted-foreground text-xs">{plantCareNote.species}</p>
			</CardHeader>
			<CardContent>
				<p className="text-sm">{plantCareNote.note}</p>
			</CardContent>
		</Card>
	);
}

function PlantCareNotePanelSkeleton() {
	return (
		<Card className="border border-border/80 bg-background/60">
			<CardHeader className="gap-2">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-3 w-24" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-4 w-80 max-w-full" />
			</CardContent>
		</Card>
	);
}

function PlantCareNotePanelError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="Failed to load care note"
		/>
	);
}

PlantCareNotePanel.Skeleton = PlantCareNotePanelSkeleton;
PlantCareNotePanel.Error = PlantCareNotePanelError;
