import { Button } from "@graphql-conf/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@graphql-conf/ui/components/card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
	className?: string;
	error: unknown;
	onRetry?: () => void;
	retryLabel?: string;
	title?: string;
}

export function ErrorState({
	title = "Something went wrong",
	error,
	retryLabel = "Try again",
	onRetry,
	className,
}: ErrorStateProps) {
	const message =
		error instanceof Error && error.message.trim()
			? error.message
			: "An unexpected error occurred.";

	return (
		<Card
			className={cn(
				"border border-border/80 border-dashed bg-muted/20",
				className
			)}
		>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{message}</CardDescription>
			</CardHeader>
			{onRetry ? (
				<CardContent>
					<Button onClick={onRetry} size="sm" variant="outline">
						{retryLabel}
					</Button>
				</CardContent>
			) : null}
		</Card>
	);
}
