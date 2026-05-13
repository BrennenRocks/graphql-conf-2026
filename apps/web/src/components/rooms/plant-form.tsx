import { Button } from "@graphql-conf/ui/components/button";
import { Input } from "@graphql-conf/ui/components/input";
import { Label } from "@graphql-conf/ui/components/label";
import { Loader2 } from "lucide-react";
import { type SubmitEvent, useId, useState } from "react";

interface RoomOption {
	id: string;
	name: string;
}

export interface PlantFormValues {
	name: string;
	roomId: string;
	species: string;
}

interface PlantFormProps {
	defaultValues: PlantFormValues;
	isRoomSelectDisabled?: boolean;
	isSubmitting: boolean;
	onCancel?: () => void;
	onSubmit: (values: PlantFormValues) => Promise<void> | void;
	roomOptions?: RoomOption[];
	roomSelectError?: string;
	submitLabel: string;
}

export function PlantForm({
	defaultValues,
	isRoomSelectDisabled = false,
	isSubmitting,
	onCancel,
	onSubmit,
	roomOptions,
	roomSelectError,
	submitLabel,
}: PlantFormProps) {
	const id = useId();
	const [name, setName] = useState(defaultValues.name);
	const [roomId, setRoomId] = useState(defaultValues.roomId);
	const [species, setSpecies] = useState(defaultValues.species);
	const trimmedName = name.trim();
	const trimmedSpecies = species.trim();
	const canSubmit = Boolean(
		trimmedName && trimmedSpecies && roomId && !isSubmitting
	);

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canSubmit) {
			return;
		}

		Promise.resolve(
			onSubmit({
				name: trimmedName,
				roomId,
				species: trimmedSpecies,
			})
		).catch(() => undefined);
	};

	return (
		<form className="grid gap-3" onSubmit={handleSubmit}>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-plant-name`}>Name</Label>
				<Input
					disabled={isSubmitting}
					id={`${id}-plant-name`}
					onChange={(event) => setName(event.target.value)}
					placeholder="Monstera"
					value={name}
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-plant-species`}>Species</Label>
				<Input
					disabled={isSubmitting}
					id={`${id}-plant-species`}
					onChange={(event) => setSpecies(event.target.value)}
					placeholder="Monstera deliciosa"
					value={species}
				/>
			</div>
			{roomOptions ? (
				<div className="grid gap-1.5">
					<Label htmlFor={`${id}-plant-room`}>Room</Label>
					<select
						className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30"
						disabled={isSubmitting || isRoomSelectDisabled}
						id={`${id}-plant-room`}
						onChange={(event) => setRoomId(event.target.value)}
						value={roomId}
					>
						{roomOptions.map((roomOption) => {
							return (
								<option key={roomOption.id} value={roomOption.id}>
									{roomOption.name}
								</option>
							);
						})}
					</select>
					{roomSelectError ? (
						<p className="text-destructive text-xs">{roomSelectError}</p>
					) : null}
				</div>
			) : null}
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
