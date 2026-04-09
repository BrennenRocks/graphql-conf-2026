import {
	Card,
	CardContent,
	CardHeader,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";

const MISSION_SHELL_SKELETON_IDS = [
	"crew-shell",
	"ship-shell",
	"tools-shell",
] as const;

export function MissionDetailShellSkeleton() {
	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<Card className="border border-border/80">
				<CardHeader className="gap-3">
					<Skeleton className="h-3 w-24" />
					<Skeleton className="h-8 w-56" />
					<Skeleton className="h-4 w-40" />
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-4 w-28" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-4 w-32" />
					</div>
				</CardContent>
			</Card>
			<div className="grid gap-4 lg:grid-cols-3">
				{MISSION_SHELL_SKELETON_IDS.map((skeletonId) => {
					return (
						<Card className="border border-border/80" key={skeletonId}>
							<CardHeader>
								<Skeleton className="h-5 w-20" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-4 w-full" />
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
