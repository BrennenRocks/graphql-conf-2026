import { graphql } from "@/__gql__";

export const DeleteRoomMutation = graphql(/* GraphQL */ `
	mutation DeleteRoomMutation($input: DeleteRoomInput!) {
		deleteRoom(input: $input) {
			id
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

export const DeletePlantMutation = graphql(/* GraphQL */ `
	mutation DeletePlantMutation($input: DeletePlantInput!) {
		deletePlant(input: $input) {
			plant {
				id
				roomId
				name
				species
			}
			room {
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
