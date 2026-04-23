import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";

export function RoomEmptySelection() {
	return (
		<div className="flex h-full items-center justify-center p-6">
			<Card className="max-w-lg border border-border/80 border-dashed bg-muted/20">
				<CardHeader>
					<CardTitle>Pick a room</CardTitle>
					<CardDescription>
						Select a room from the left rail to open the plant collection.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						This first slice focuses on route preload, colocated fragments, and
						cache-backed reads. Room editing and plant moves can layer on top
						next.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
