import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { createQueryPreloader } from "@apollo/client/react";
import { env } from "@graphql-conf/env/web";
import { toast } from "sonner";

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

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: ApolloLink.from([errorLink, httpLink]),
});

export const preloadQuery = createQueryPreloader(apolloClient);
