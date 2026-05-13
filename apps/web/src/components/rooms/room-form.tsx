import { Button } from "@graphql-conf/ui/components/button";
import { Input } from "@graphql-conf/ui/components/input";
import { Label } from "@graphql-conf/ui/components/label";
import { Loader2 } from "lucide-react";
import { type SubmitEvent, useId, useState } from "react";

interface RoomFormValues {
	description: string;
	name: string;
}

interface RoomFormProps {
	defaultValues?: RoomFormValues;
	isSubmitting: boolean;
	onCancel?: () => void;
	onSubmit: (values: RoomFormValues) => Promise<void> | void;
	submitLabel: string;
}

const emptyRoomFormValues = {
	description: "",
	name: "",
} satisfies RoomFormValues;

export function RoomForm({
	defaultValues = emptyRoomFormValues,
	isSubmitting,
	onCancel,
	onSubmit,
	submitLabel,
}: RoomFormProps) {
	const id = useId();
	const [description, setDescription] = useState(defaultValues.description);
	const [name, setName] = useState(defaultValues.name);
	const trimmedDescription = description.trim();
	const trimmedName = name.trim();
	const canSubmit = Boolean(trimmedDescription && trimmedName && !isSubmitting);

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canSubmit) {
			return;
		}

		Promise.resolve(
			onSubmit({
				description: trimmedDescription,
				name: trimmedName,
			})
		).catch(() => undefined);
	};

	return (
		<form className="grid gap-3" onSubmit={handleSubmit}>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-room-name`}>Name</Label>
				<Input
					disabled={isSubmitting}
					id={`${id}-room-name`}
					onChange={(event) => setName(event.target.value)}
					placeholder="Sunroom"
					value={name}
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-room-description`}>Description</Label>
				<textarea
					className="min-h-16 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30"
					disabled={isSubmitting}
					id={`${id}-room-description`}
					onChange={(event) => setDescription(event.target.value)}
					placeholder="Bright afternoon light with space for shelves."
					value={description}
				/>
			</div>
			<div className="flex flex-wrap justify-end gap-2">
				{onCancel ? (
					<Button
						disabled={isSubmitting}
						onClick={onCancel}
						type="button"
						variant="outline"
					>
						Cancel
					</Button>
				) : null}
				<Button disabled={!canSubmit} type="submit">
					{isSubmitting ? <Loader2 className="animate-spin" /> : null}
					{submitLabel}
				</Button>
			</div>
		</form>
	);
}
