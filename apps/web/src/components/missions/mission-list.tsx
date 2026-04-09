import { useRouterState } from "@tanstack/react-router";
import { MissionListEmptyState } from "./mission-list-empty-state";
import { MissionListItem } from "./mission-list-item";
import type { MissionPlannerMission } from "./mission-planner-context";

const getSelectedMissionId = (state: {
	matches: Array<{
		params: Record<string, unknown>;
		routeId: string;
	}>;
}) => {
	const missionMatch = state.matches.find((match) => {
		return match.routeId === "/missions/$missionId";
	});

	const missionId = missionMatch?.params.missionId;

	return typeof missionId === "string" ? missionId : undefined;
};

interface MissionListProps {
	missions: MissionPlannerMission[];
}

export function MissionList({ missions }: MissionListProps) {
	const selectedMissionId = useRouterState({
		select: getSelectedMissionId,
	});

	return (
		<aside className="flex h-full min-h-0 flex-col">
			<div className="border-b px-5 py-4">
				<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
					Planner
				</p>
				<h1 className="font-heading text-xl">Missions</h1>
				<p className="text-muted-foreground text-sm">
					Choose a target to start planning the run.
				</p>
			</div>
			{missions.length === 0 ? (
				<MissionListEmptyState />
			) : (
				<nav
					aria-label="Mission list"
					className="flex-1 overflow-y-auto px-3 py-3"
				>
					<div className="grid gap-3">
						{missions.map((mission) => {
							return (
								<MissionListItem
									isActive={mission.id === selectedMissionId}
									key={mission.id}
									mission={mission}
								/>
							);
						})}
					</div>
				</nav>
			)}
		</aside>
	);
}
