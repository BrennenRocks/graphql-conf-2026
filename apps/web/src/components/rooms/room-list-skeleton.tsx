import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";

const ROOM_LIST_SKELETON_IDS = [
	"room-alpha",
	"room-bravo",
	"room-charlie",
	"room-delta",
] as const;

export function RoomListSkeleton() {
	return (
		<aside className="flex h-full min-h-0 flex-col">
			<div className="border-b px-5 py-4">
				<Skeleton className="mb-2 h-3 w-20" />
				<Skeleton className="mb-2 h-7 w-28" />
				<Skeleton className="h-4 w-48" />
			</div>
			<div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
				{ROOM_LIST_SKELETON_IDS.map((skeletonId) => {
					return (
						<Card className="gap-3 py-3" key={skeletonId} size="sm">
							<CardHeader className="gap-2">
								<div className="flex items-start justify-between gap-3">
									<CardTitle className="w-full">
										<Skeleton className="h-5 w-28" />
									</CardTitle>
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-full" />
							</CardContent>
						</Card>
					);
				})}
			</div>
		</aside>
	);
}
