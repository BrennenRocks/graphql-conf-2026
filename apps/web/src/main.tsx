import { ApolloProvider } from "@apollo/client/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import Loader from "./components/loader";
import { apolloClient } from "./lib/apollo-client";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
	defaultPreload: "intent",
	defaultPendingComponent: () => <Loader />,
	routeTree,
	Wrap({ children }: { children: React.ReactNode }) {
		return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");

if (!rootElement) {
	throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<RouterProvider router={router} />);
}
