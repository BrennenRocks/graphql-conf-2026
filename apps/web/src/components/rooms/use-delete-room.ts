import { useMutation } from "@apollo/client/react";
import { useNavigate } from "@tanstack/react-router";

import {
	evictRoomFromCache,
	removeRoomEdgeFromRoomsConnection,
} from "./room-cache";
import { DeleteRoomMutation } from "./room-operations";

export function useDeleteRoom() {
	const navigate = useNavigate();
	return useMutation(DeleteRoomMutation, {
		onCompleted: async () => {
			await navigate({ to: "/rooms" });
		},
		optimisticResponse: (variables) => {
			return {
				__typename: "Mutation",
				deleteRoom: {
					__typename: "DeleteRoomPayload",
					id: variables.input.id,
				},
			} as const;
		},
		update(cache, { data: mutationData }) {
			const roomId = mutationData?.deleteRoom.id;

			if (!roomId) {
				return;
			}

			removeRoomEdgeFromRoomsConnection(cache, roomId);
			evictRoomFromCache(cache, roomId);
		},
	});
}
