import {
	Card,
	CardContent,
	CardHeader,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";

const ROOM_PLANT_SKELETON_IDS = [
	"plant-alpha",
	"plant-bravo",
	"plant-charlie",
] as const;

export function RoomDetailShellSkeleton() {
	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<Card className="border border-border/80">
				<CardHeader className="gap-3">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-5 w-24 rounded-full" />
				</CardContent>
			</Card>
			<Card className="border border-border/80">
				<CardHeader>
					<Skeleton className="h-6 w-20" />
				</CardHeader>
				<CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
					{ROOM_PLANT_SKELETON_IDS.map((skeletonId) => {
						return (
							<Card className="border border-border/80" key={skeletonId}>
								<CardHeader className="gap-2">
									<Skeleton className="h-5 w-28" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-32" />
								</CardContent>
							</Card>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}
