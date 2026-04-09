import { useSuspenseFragment } from "@apollo/client/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { useParams } from "@tanstack/react-router";

import { graphql } from "@/__gql__";
import { cn } from "@/lib/utils";

import {
	formatMissionPayout,
	getMissionRiskStyles,
} from "./mission-presentation";

export const MissionShellHeaderFragment = graphql(/* GraphQL */ `
	fragment MissionShellHeader_mission on Mission {
		id
		codeName
		targetName
		destination
		payout
		riskLevel
	}
`);

export function MissionShellHeader() {
	const { missionId } = useParams({ from: "/missions/$missionId" });
	const { data } = useSuspenseFragment({
		fragment: MissionShellHeaderFragment,
		fragmentName: "MissionShellHeader_mission",
		from: {
			__typename: "Mission",
			id: missionId,
		},
	});

	return (
		<Card className="border border-border/80 bg-card/80">
			<CardHeader className="gap-3">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
							{data.codeName}
						</p>
						<CardTitle className="text-2xl">{data.targetName}</CardTitle>
						<CardDescription className="text-sm">
							Planning shell for {data.destination}
						</CardDescription>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 font-medium text-xs">
							{formatMissionPayout(data.payout)}
						</span>
						<span
							className={cn(
								"rounded-full border px-3 py-1 font-medium text-xs",
								getMissionRiskStyles(data.riskLevel)
							)}
						>
							Risk {data.riskLevel}
						</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className="grid gap-4 sm:grid-cols-2">
				<div>
					<p className="text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
						Target
					</p>
					<p className="text-sm">{data.targetName}</p>
				</div>
				<div>
					<p className="text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
						Destination
					</p>
					<p className="text-sm">{data.destination}</p>
				</div>
			</CardContent>
		</Card>
	);
}
