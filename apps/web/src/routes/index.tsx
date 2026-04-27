import { useSuspenseQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { graphql } from "@/__gql__";
import { ErrorState } from "@/components/shared/error-state";

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

interface ApiStatusCardProps {
	apiStatus: string;
	isConnected: boolean;
}

function HomeComponent() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<ErrorBoundary FallbackComponent={ApiStatusError}>
					<Suspense
						fallback={
							<ApiStatusCard apiStatus="Checking..." isConnected={false} />
						}
					>
						<ApiStatusQuery />
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	);
}

function ApiStatusQuery() {
	const { data } = useSuspenseQuery(HomeRouteQuery);
	const isConnected = data.healthCheck === "OK";

	return (
		<ApiStatusCard
			apiStatus={isConnected ? "Connected" : "Disconnected"}
			isConnected={isConnected}
		/>
	);
}

function ApiStatusError({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="API unreachable"
		/>
	);
}

function ApiStatusCard({ apiStatus, isConnected }: ApiStatusCardProps) {
	return (
		<section className="rounded-lg border p-4">
			<h2 className="mb-2 font-medium">API Status</h2>
			<div className="flex items-center gap-2">
				<div
					className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
				/>
				<span className="text-muted-foreground text-sm">{apiStatus}</span>
			</div>
		</section>
	);
}
