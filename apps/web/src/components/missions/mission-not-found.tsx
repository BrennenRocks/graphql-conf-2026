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

export function MissionNotFound() {
	const { missionId } = useParams({ from: "/missions/$missionId" });

	return (
		<div className="flex h-full items-center justify-center p-6">
			<Card className="max-w-lg border border-border/80 border-dashed bg-muted/20">
				<CardHeader>
					<CardTitle>Mission not found</CardTitle>
					<CardDescription>
						The selected mission is not available in the preloaded list.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						No mission matched <code className="font-mono">{missionId}</code>.
					</p>
					<Link
						className={cn(buttonVariants({ variant: "outline" }))}
						to="/missions"
					>
						Back to all missions
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
