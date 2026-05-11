import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { createQueryPreloader } from "@apollo/client/react";
import { relayStylePagination } from "@apollo/client/utilities";
import { env } from "@graphql-conf/env/web";
import { toast } from "sonner";

import type { TypedTypePolicies } from "@/__gql__/apollo-helpers";

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
	credentials: "include",
	uri: `${env.VITE_SERVER_URL}/graphql`,
});

const typePolicies = {
	Query: {
		fields: {
			roomsConnection: relayStylePagination(),
		},
	},
	Room: {
		fields: {
			plantsConnection: relayStylePagination(),
		},
	},
} satisfies TypedTypePolicies;

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies,
	}),
	link: ApolloLink.from([errorLink, httpLink]),
});

export const preloadQuery = createQueryPreloader(apolloClient);
