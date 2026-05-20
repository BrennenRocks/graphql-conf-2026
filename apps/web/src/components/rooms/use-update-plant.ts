import { gql } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { graphql } from "@/__gql__";
import {
	addOrReplacePlantEdgeInRoom,
	readRoomPlantCount,
	removePlantEdgeFromRoom,
} from "./room-cache";

const UpdatePlantMutation = graphql(/* GraphQL */ `
	mutation UpdatePlantMutation($input: UpdatePlantInput!) {
		updatePlant(input: $input) {
			plant {
				id
				roomId
				name
				species
			}
			plantEdge {
				cursor
				node {
					id
					roomId
					name
					species
				}
			}
			room {
				id
				plantCount
			}
			previousRoom {
				id
				plantCount
			}
		}
	}
`);

interface UpdatePlantOptimisticResponsePlant {
	id: string;
	name: string;
	roomId: string;
	species: string;
}

export function useUpdatePlant() {
	const apolloClient = useApolloClient();

	return useMutation(UpdatePlantMutation, {
		optimisticResponse: (variables, { IGNORE }) => {
			const { id, name, roomId, species } = variables.input;
			const plant =
				apolloClient.cache.readFragment<UpdatePlantOptimisticResponsePlant>({
					fragment: PlantUpdateOptimisticResponseFragment,
					id: apolloClient.cache.identify({
						__typename: "Plant",
						id,
					}),
				});

			if (!plant) {
				return IGNORE;
			}

			const didMoveRooms = roomId !== plant.roomId;
			const targetRoomPlantCount = readRoomPlantCount(
				apolloClient.cache,
				roomId
			);
			const previousRoomPlantCount = readRoomPlantCount(
				apolloClient.cache,
				plant.roomId
			);
			const previousRoom = didMoveRooms
				? ({
						__typename: "Room",
						id: plant.roomId,
						plantCount: Math.max(0, previousRoomPlantCount - 1),
					} as const)
				: null;

			return {
				__typename: "Mutation",
				updatePlant: {
					__typename: "UpdatePlantPayload",
					plant: {
						__typename: "Plant",
						id,
						name,
						roomId,
						species,
					},
					plantEdge: {
						__typename: "PlantEdge",
						cursor: `optimistic-plant-${id}`,
						node: {
							__typename: "Plant",
							id,
							name,
							roomId,
							species,
						},
					},
					previousRoom,
					room: {
						__typename: "Room",
						id: roomId,
						plantCount: didMoveRooms
							? targetRoomPlantCount + 1
							: targetRoomPlantCount,
					},
				},
			} as const;
		},
		update(cache, { data: mutationData }) {
			const payload = mutationData?.updatePlant;

			if (!payload) {
				return;
			}

			if (payload.previousRoom && payload.previousRoom.id !== payload.room.id) {
				removePlantEdgeFromRoom(
					cache,
					payload.previousRoom.id,
					payload.plant.id
				);
			}

			addOrReplacePlantEdgeInRoom(cache, payload.room.id, payload.plantEdge);
		},
	});
}

const PlantUpdateOptimisticResponseFragment = gql`
	fragment PlantUpdateOptimisticResponse_plant on Plant {
		id
		name
		roomId
		species
	}
`;
