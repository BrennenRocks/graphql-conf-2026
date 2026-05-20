import { useApolloClient, useMutation } from "@apollo/client/react";
import { graphql } from "@/__gql__";
import { readRoomPlantCount } from "./room-cache";

const UpdateRoomMutation = graphql(/* GraphQL */ `
	mutation UpdateRoomMutation($input: UpdateRoomInput!) {
		updateRoom(input: $input) {
			room {
				id
				name
				description
				plantCount
			}
		}
	}
`);

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
				},
			} as const;
		},
	});
}
