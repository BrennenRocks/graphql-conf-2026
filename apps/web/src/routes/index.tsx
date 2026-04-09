import { useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";

import { graphql } from "@/__gql__";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const HomeRouteQuery = graphql(/* GraphQL */ `
  query HomeRouteQuery {
    healthCheck
  }
`);

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

function HomeComponent() {
	const { data, error, loading } = useQuery(HomeRouteQuery);
	const isConnected = data?.healthCheck === "OK";
	let apiStatus = "Disconnected";

	if (loading) {
		apiStatus = "Checking...";
	} else if (isConnected) {
		apiStatus = "Connected";
	} else if (error) {
		apiStatus = `Disconnected: ${error.message}`;
	}

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
						/>
						<span className="text-muted-foreground text-sm">{apiStatus}</span>
					</div>
				</section>
			</div>
		</div>
	);
}
