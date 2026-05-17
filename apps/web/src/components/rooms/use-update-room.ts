import { useApolloClient, useMutation } from "@apollo/client/react";

import { readRoomPlantCount } from "./room-cache";
import { UpdateRoomMutation } from "./room-operations";

export function useUpdateRoom() {
	const apolloClient = useApolloClient();

	return useMutation(UpdateRoomMutation, {
		optimisticResponse: (variables) => {
			const { description, id, name } = variables.input;
			const plantCount = readRoomPlantCount(apolloClient.cache, id);

			return {
				__typename: "Mutation",
				updateRoom: {
					__typename: "UpdateRoomPayload",
					room: {
						__typename: "Room",
						description,
						id,
						name,
						plantCount,
					},
					roomEdge: {
						__typename: "RoomEdge",
						cursor: `optimistic-room-${id}`,
						node: {
							__typename: "Room",
							description,
							id,
							name,
							plantCount,
						},
					},
				},
			} as const;
		},
	});
}
