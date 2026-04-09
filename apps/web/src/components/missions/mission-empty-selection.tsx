import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";

export function MissionEmptySelection() {
	return (
		<div className="flex h-full items-center justify-center p-6">
			<Card className="max-w-lg border border-border/80 border-dashed bg-muted/20">
				<CardHeader>
					<CardTitle>Pick a mission</CardTitle>
					<CardDescription>
						Select a target from the left rail to open the first planner shell.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						We will add crew assignment, ship loadout, and tool planning in the
						next slices. For now this view just establishes the route, preload,
						and selection flow.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
