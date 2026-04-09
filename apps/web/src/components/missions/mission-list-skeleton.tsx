import {
	Card,
	CardContent,
	CardHeader,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";

const MISSION_LIST_SKELETON_IDS = [
	"mission-alpha",
	"mission-bravo",
	"mission-charlie",
	"mission-delta",
	"mission-echo",
] as const;

export function MissionListSkeleton() {
	return (
		<aside className="flex h-full min-h-0 flex-col">
			<div className="border-b px-5 py-4">
				<Skeleton className="mb-2 h-3 w-20" />
				<Skeleton className="mb-2 h-7 w-28" />
				<Skeleton className="h-4 w-52" />
			</div>
			<div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
				{MISSION_LIST_SKELETON_IDS.map((skeletonId) => {
					return (
						<Card className="gap-3 py-3" key={skeletonId} size="sm">
							<CardHeader className="gap-2">
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-5 w-36" />
							</CardHeader>
							<CardContent className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<div className="flex items-center justify-between gap-3">
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</aside>
	);
}
