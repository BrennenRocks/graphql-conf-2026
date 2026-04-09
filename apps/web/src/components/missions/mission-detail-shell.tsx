import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { useParams } from "@tanstack/react-router";

import { MissionNotFound } from "./mission-not-found";
import { useMissionPlannerContext } from "./mission-planner-context";
import { MissionShellHeader } from "./mission-shell-header";

const PLACEHOLDER_SECTIONS = [
	{
		description: "Crew assignments land here next.",
		title: "Crew",
	},
	{
		description: "Ship selection lands here next.",
		title: "Ship",
	},
	{
		description: "Tool loadout lands here next.",
		title: "Tools",
	},
] as const;

export function MissionDetailShell() {
	const { missionId } = useParams({ from: "/missions/$missionId" });
	const { missions } = useMissionPlannerContext();
	const mission = missions.find((candidate) => {
		return candidate.id === missionId;
	});

	if (!mission) {
		return <MissionNotFound />;
	}

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 md:p-6">
			<MissionShellHeader />
			<div className="grid gap-4 lg:grid-cols-3">
				{PLACEHOLDER_SECTIONS.map((section) => {
					return (
						<Card
							className="border border-border/80 bg-card/80"
							key={section.title}
						>
							<CardHeader>
								<CardTitle>{section.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									{section.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
