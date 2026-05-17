import {
	ApolloClient,
	ApolloLink,
	type FieldFunctionOptions,
	HttpLink,
	InMemoryCache,
	type Reference,
	type StoreObject,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { createQueryPreloader } from "@apollo/client/react";
import { relayStylePagination } from "@apollo/client/utilities";
import { env } from "@graphql-conf/env/web";
import { toast } from "sonner";

import type { TypedTypePolicies } from "@/__gql__/apollo-helpers";

type ConnectionEdge = Reference | StoreObject;

interface Connection {
	edges?: readonly ConnectionEdge[];
}

const roomsConnectionPagination = relayStylePagination();

const dedupeConnectionEdges = <TConnection extends Connection | null>(
	connection: TConnection,
	readField: FieldFunctionOptions["readField"],
	canRead: FieldFunctionOptions["canRead"]
) => {
	if (!connection?.edges) {
		return connection;
	}

	const seenNodeIds = new Set<string>();
	const edges = connection.edges.filter((edge) => {
		const node = readField<Reference | StoreObject>("node", edge);

		if (!(node && canRead(node))) {
			return false;
		}

		const nodeId = readField<string>("id", node);

		if (!nodeId) {
			return true;
		}

		if (seenNodeIds.has(nodeId)) {
			return false;
		}

		seenNodeIds.add(nodeId);
		return true;
	});

	if (edges.length === connection.edges.length) {
		return connection;
	}

	return {
		...connection,
		edges,
	};
};

const errorLink = new ErrorLink(({ error }) => {
	const message = CombinedGraphQLErrors.is(error)
		? error.errors
				.map(({ message: graphqlMessage }) => graphqlMessage)
				.join("\n")
		: error.message;

	if (!message.trim()) {
		return;
	}

	toast.error(message);
});

const httpLink = new HttpLink({
	uri: `${env.VITE_SERVER_URL}/graphql`,
});

const typePolicies = {
	Query: {
		fields: {
			roomsConnection: {
				...roomsConnectionPagination,
				read(existing, options) {
					const connection =
						roomsConnectionPagination.read?.(existing, options) ?? existing;

					return dedupeConnectionEdges(
						connection,
						options.readField,
						options.canRead
					);
				},
			},
		},
	},
	Room: {
		fields: {
			plantsConnection: {
				...relayStylePagination(),
				read(existing, options) {
					return dedupeConnectionEdges(
						existing,
						options.readField,
						options.canRead
					);
				},
			},
		},
	},
} satisfies TypedTypePolicies;

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies,
	}),
	link: ApolloLink.from([errorLink, httpLink]),
	devtools: {
		enabled: true,
	},
});

export const preloadQuery = createQueryPreloader(apolloClient);
