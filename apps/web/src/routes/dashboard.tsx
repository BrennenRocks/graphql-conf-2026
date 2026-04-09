import { useQuery } from "@apollo/client/react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { graphql } from "@/__gql__";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			redirect({
				to: "/login",
				throw: true,
			});
		}
		return { session };
	},
});

const DashboardRouteQuery = graphql(/* GraphQL */ `
  query DashboardRouteQuery {
    privateData {
      message
      user {
        email
        id
        name
      }
    }
  }
`);

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const { data, error, loading } = useQuery(DashboardRouteQuery);
	let privateMessage = data?.privateData.message ?? "Unavailable";

	if (loading) {
		privateMessage = "Loading...";
	} else if (error) {
		privateMessage = error.message;
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.data?.user.name}</p>
			<p>API: {privateMessage}</p>
		</div>
	);
}
