import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";

export function RoomListEmptyState() {
	return (
		<div className="flex flex-1 items-center justify-center p-4">
			<Card className="max-w-sm border border-border/80 border-dashed bg-muted/20">
				<CardHeader>
					<CardTitle>No rooms yet</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						The database is connected, but there are no rooms to browse yet.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
