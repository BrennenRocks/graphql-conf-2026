import { graphql } from "@/__gql__";

export const UpdateRoomMutation = graphql(/* GraphQL */ `
	mutation UpdateRoomMutation($input: UpdateRoomInput!) {
		updateRoom(input: $input) {
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

export const CreatePlantMutation = graphql(/* GraphQL */ `
	mutation CreatePlantMutation($input: CreatePlantInput!) {
		createPlant(input: $input) {
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

export const UpdatePlantMutation = graphql(/* GraphQL */ `
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

export const RoomPickerQuery = graphql(/* GraphQL */ `
	query RoomPickerQuery {
		roomsConnection(first: 50) {
			edges {
				node {
					id
					name
				}
			}
		}
	}
`);
