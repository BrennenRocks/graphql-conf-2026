import { useSuspenseFragment } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { Link } from "@tanstack/react-router";
import { graphql } from "@/__gql__";
import type { FragmentType } from "@/__gql__/fragment-masking";
import { cn } from "@/lib/utils";

import {
	formatMissionPayout,
	getMissionRiskStyles,
} from "./mission-presentation";

export const MissionListItemFragment = graphql(/* GraphQL */ `
	fragment MissionListItem_mission on Mission {
		id
		codeName
		targetName
		destination
		payout
		riskLevel
	}
`);

interface MissionListItemProps {
	isActive: boolean;
	mission: FragmentType<typeof MissionListItemFragment>;
}

export function MissionListItem({ isActive, mission }: MissionListItemProps) {
	const { data } = useSuspenseFragment({
		fragment: MissionListItemFragment,
		fragmentName: "MissionListItem_mission",
		from: mission,
	});

	return (
		<Link
			params={{ missionId: data.id }}
			preload="intent"
			to="/missions/$missionId"
		>
			<Card
				className={cn(
					"gap-3 border border-border/70 bg-card/80 py-3 transition-colors hover:border-primary/40 hover:bg-accent/30",
					isActive && "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
				)}
				size="sm"
			>
				<CardHeader className="gap-2">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1">
							<p className="text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
								{data.codeName}
							</p>
							<CardTitle className="text-base">{data.targetName}</CardTitle>
						</div>
						<div className="rounded-full border border-border/80 bg-background/80 px-2 py-1 font-medium text-[0.7rem]">
							{formatMissionPayout(data.payout)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="space-y-1">
						<p className="text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
							Destination
						</p>
						<p className="text-sm">{data.destination}</p>
					</div>
					<div className="flex items-center justify-between gap-3">
						<p className="text-muted-foreground text-xs">
							Target: {data.targetName}
						</p>
						<span
							className={cn(
								"rounded-full border px-2 py-1 font-medium text-[0.7rem]",
								getMissionRiskStyles(data.riskLevel)
							)}
						>
							Risk {data.riskLevel}
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
