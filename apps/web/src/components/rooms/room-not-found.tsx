import { buttonVariants } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Link, useParams } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function RoomNotFound() {
	const { roomId } = useParams({ from: "/rooms/$roomId" });

	return (
		<div className="flex h-full items-center justify-center p-6">
			<Card className="max-w-lg border border-border/80 border-dashed bg-muted/20">
				<CardHeader>
					<CardTitle>Room not found</CardTitle>
					<CardDescription>
						The selected room is not available in the preloaded list.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						No room matched <code className="font-mono">{roomId}</code>.
					</p>
					<Link
						className={cn(buttonVariants({ variant: "outline" }))}
						to="/rooms"
					>
						Back to all rooms
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
