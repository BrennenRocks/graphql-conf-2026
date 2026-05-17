import { gql } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";

import {
	evictPlantFromCache,
	readRoomPlantCount,
	removePlantEdgeFromRoom,
} from "./room-cache";
import { DeletePlantMutation } from "./room-operations";

interface DeletePlantInput {
	id: string;
	name: string;
	roomId: string;
	species: string;
}

export function useDeletePlant() {
	const apolloClient = useApolloClient();
	return useMutation(DeletePlantMutation, {
		optimisticResponse: (variables, { IGNORE }) => {
			const { id } = variables.input;
			const plant = apolloClient.cache.readFragment<DeletePlantInput>({
				fragment: PlantDeleteOptimisticResponseFragment,
				id: apolloClient.cache.identify({
					__typename: "Plant",
					id,
				}),
			});

			if (!plant) {
				return IGNORE;
			}

			const plantCount = readRoomPlantCount(apolloClient.cache, plant.roomId);

			return {
				__typename: "Mutation",
				deletePlant: {
					__typename: "DeletePlantPayload",
					plant: {
						__typename: "Plant",
						id: plant.id,
						name: plant.name,
						roomId: plant.roomId,
						species: plant.species,
					},
					room: {
						__typename: "Room",
						id: plant.roomId,
						plantCount: Math.max(0, plantCount - 1),
					},
				},
			} as const;
		},
		update(cache, { data: mutationData }) {
			const payload = mutationData?.deletePlant;

			if (!payload) {
				return;
			}

			removePlantEdgeFromRoom(cache, payload.plant.roomId, payload.plant.id);
			evictPlantFromCache(cache, payload.plant.id);
		},
	});
}

const PlantDeleteOptimisticResponseFragment = gql`
	fragment PlantDeleteOptimisticResponse_plant on Plant {
		id
		name
		roomId
		species
	}
`;
