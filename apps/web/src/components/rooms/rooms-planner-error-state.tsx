import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";

interface RoomsPlannerErrorStateProps {
	error: unknown;
}

export function RoomsPlannerErrorState({ error }: RoomsPlannerErrorStateProps) {
	const message =
		error instanceof Error && error.message.trim()
			? error.message
			: "Unable to load rooms right now.";

	return (
		<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[23rem_minmax(0,1fr)]">
			<aside className="border-border/80 border-b bg-card/40 md:border-r md:border-b-0">
				<div className="border-b px-5 py-4">
					<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
						Houseplant Planner
					</p>
					<h1 className="font-heading text-xl">Rooms</h1>
				</div>
				<div className="p-4">
					<Card className="border border-border/80 border-dashed bg-muted/20">
						<CardHeader>
							<CardTitle>Room feed unavailable</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">
								The left rail could not load.
							</p>
						</CardContent>
					</Card>
				</div>
			</aside>
			<div className="flex items-center justify-center p-6">
				<Card className="max-w-lg border border-border/80 border-dashed bg-muted/20">
					<CardHeader>
						<CardTitle>Unable to load the planner</CardTitle>
						<CardDescription>
							The room planner hit an error while loading data.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">{message}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
