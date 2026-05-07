import { type QueryRef, useReadQuery } from "@apollo/client/react";
import { Skeleton } from "@graphql-conf/ui/components/skeleton";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import type { DocumentType } from "@/__gql__";
import { graphql } from "@/__gql__";
import { ErrorState } from "@/components/shared/error-state";
import { preloadQuery } from "@/lib/apollo-client";
import { authClient } from "@/lib/auth-client";

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

type DashboardQueryRef = QueryRef<DocumentType<typeof DashboardRouteQuery>>;

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
	loader: () => {
		return {
			queryRef: preloadQuery(DashboardRouteQuery),
		};
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const { queryRef } = Route.useLoaderData();

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.data?.user.name}</p>
			<ErrorBoundary FallbackComponent={DashboardPrivateMessageError}>
				<Suspense fallback={<DashboardPrivateMessageSkeleton />}>
					<DashboardPrivateMessage queryRef={queryRef} />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}

interface DashboardPrivateMessageProps {
	queryRef: DashboardQueryRef;
}

function DashboardPrivateMessage({ queryRef }: DashboardPrivateMessageProps) {
	const { data } = useReadQuery(queryRef);
	return <p>API: {data.privateData.message}</p>;
}

function DashboardPrivateMessageSkeleton() {
	return <Skeleton className="h-5 w-48" />;
}

function DashboardPrivateMessageError({
	error,
	resetErrorBoundary,
}: FallbackProps) {
	return (
		<ErrorState
			error={error}
			onRetry={resetErrorBoundary}
			title="Failed to load dashboard"
		/>
	);
}
