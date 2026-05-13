import { useMutation } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { type UIEvent, useState } from "react";

import { graphql } from "@/__gql__";

import { addRoomEdgeToRoomsConnection } from "./room-cache";
import { RoomForm } from "./room-form";
import { RoomListEmptyState } from "./room-list-empty-state";
import { RoomListItem } from "./room-list-item";
import type { RoomsPlannerRoom } from "./rooms-planner-layout";

const SCROLL_LOAD_THRESHOLD_PX = 160;

const CreateRoomMutation = graphql(/* GraphQL */ `
	mutation CreateRoomMutation($input: CreateRoomInput!) {
		createRoom(input: $input) {
			room {
				id
				name
				description
				plantCount
			}
			roomEdge {
				cursor
				node {
					id
					name
					description
					plantCount
				}
			}
		}
	}
`);

const getSelectedRoomId = (state: {
	matches: Array<{
		params: Record<string, unknown>;
		routeId: string;
	}>;
}) => {
	const roomMatch = state.matches.find((match) => {
		return match.routeId === "/rooms/$roomId";
	});

	const roomId = roomMatch?.params.roomId;

	return typeof roomId === "string" ? roomId : undefined;
};

interface RoomListProps {
	hasNextPage: boolean;
	isLoadingMore: boolean;
	onLoadMore: () => void;
	rooms: RoomsPlannerRoom[];
}

export function RoomList({
	hasNextPage,
	isLoadingMore,
	onLoadMore,
	rooms,
}: RoomListProps) {
	const navigate = useNavigate();
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
	const selectedRoomId = useRouterState({
		select: getSelectedRoomId,
	});
	const [createRoom, { loading: isCreatingRoom }] = useMutation(
		CreateRoomMutation,
		{
			update(cache, { data }) {
				const roomEdge = data?.createRoom.roomEdge;

				if (roomEdge) {
					addRoomEdgeToRoomsConnection(cache, roomEdge);
				}
			},
		}
	);

	const handleScroll = (event: UIEvent<HTMLElement>) => {
		if (!(hasNextPage && !isLoadingMore)) {
			return;
		}

		const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

		if (distanceFromBottom <= SCROLL_LOAD_THRESHOLD_PX) {
			onLoadMore();
		}
	};

	const handleCreateRoom = async (values: {
		description: string;
		name: string;
	}) => {
		const roomId = crypto.randomUUID();
		const result = await createRoom({
			optimisticResponse: {
				__typename: "Mutation",
				createRoom: {
					__typename: "CreateRoomPayload",
					room: {
						__typename: "Room",
						description: values.description,
						id: roomId,
						name: values.name,
						plantCount: 0,
					},
					roomEdge: {
						__typename: "RoomEdge",
						cursor: `optimistic-room-${roomId}`,
						node: {
							__typename: "Room",
							description: values.description,
							id: roomId,
							name: values.name,
							plantCount: 0,
						},
					},
				},
			},
			variables: {
				input: {
					description: values.description,
					id: roomId,
					name: values.name,
				},
			},
		});
		const createdRoomId = result.data?.createRoom.room.id;

		setIsCreateFormOpen(false);

		if (createdRoomId) {
			await navigate({
				params: {
					roomId: createdRoomId,
				},
				to: "/rooms/$roomId",
			});
		}
	};

	return (
		<aside className="flex h-full min-h-0 flex-col">
			<div className="shrink-0 border-b px-5 py-4">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
							Houseplant Planner
						</p>
						<h1 className="font-heading text-xl">Rooms</h1>
					</div>
					<Button
						aria-label="Add room"
						onClick={() => setIsCreateFormOpen((isOpen) => !isOpen)}
						size="icon"
						variant="outline"
					>
						<Plus />
					</Button>
				</div>
				<p className="text-muted-foreground text-sm">
					Choose a room to inspect the plants inside it.
				</p>
				{isCreateFormOpen ? (
					<div className="mt-4 rounded-md border border-border/80 bg-background/70 p-3">
						<RoomForm
							isSubmitting={isCreatingRoom}
							onCancel={() => setIsCreateFormOpen(false)}
							onSubmit={(values) => handleCreateRoom(values)}
							submitLabel="Add room"
						/>
					</div>
				) : null}
			</div>
			{rooms.length === 0 ? (
				<RoomListEmptyState />
			) : (
				<nav
					aria-label="Room list"
					className="min-h-0 flex-1 overflow-y-auto p-3"
					onScroll={handleScroll}
				>
					<div className="grid gap-3">
						{rooms.map((room) => {
							return (
								<RoomListItem
									isActive={room.id === selectedRoomId}
									key={room.id}
									room={room}
								/>
							);
						})}
						{hasNextPage ? (
							<div className="flex justify-center">
								<Button
									disabled={isLoadingMore}
									onClick={onLoadMore}
									size="sm"
									variant="outline"
								>
									{isLoadingMore ? "Loading rooms..." : "Load more rooms"}
								</Button>
							</div>
						) : null}
					</div>
				</nav>
			)}
		</aside>
	);
}
