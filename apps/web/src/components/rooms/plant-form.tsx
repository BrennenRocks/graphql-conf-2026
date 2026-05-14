import { useSuspenseQuery } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import { Input } from "@graphql-conf/ui/components/input";
import { Label } from "@graphql-conf/ui/components/label";
import { Loader2 } from "lucide-react";
import { type SubmitEvent, Suspense, useId, useState } from "react";

import { RoomPickerQuery } from "./room-operations";

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
	roomSelectError?: string;
	showRoomSelect?: boolean;
	submitLabel: string;
}

export function PlantForm({
	defaultValues,
	isRoomSelectDisabled = false,
	isSubmitting,
	onCancel,
	onSubmit,
	roomSelectError,
	showRoomSelect = false,
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
			{showRoomSelect ? (
				<div className="grid gap-1.5">
					<Label htmlFor={`${id}-plant-room`}>Room</Label>
					<Suspense
						fallback={<PlantRoomSelectSkeleton id={`${id}-plant-room`} />}
					>
						<PlantRoomSelect
							id={`${id}-plant-room`}
							isDisabled={isSubmitting || isRoomSelectDisabled}
							onChange={setRoomId}
							value={roomId}
						/>
					</Suspense>
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

interface PlantRoomSelectProps {
	id: string;
	isDisabled: boolean;
	onChange: (roomId: string) => void;
	value: string;
}

function PlantRoomSelect({
	id,
	isDisabled,
	onChange,
	value,
}: PlantRoomSelectProps) {
	const { data } = useSuspenseQuery(RoomPickerQuery);
	const roomOptions = data.roomsConnection.edges.map((edge) => {
		return edge.node;
	});

	return (
		<select
			className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30"
			disabled={isDisabled}
			id={id}
			onChange={(event) => onChange(event.target.value)}
			value={value}
		>
			{roomOptions.map((roomOption) => {
				return (
					<option key={roomOption.id} value={roomOption.id}>
						{roomOption.name}
					</option>
				);
			})}
		</select>
	);
}

function PlantRoomSelectSkeleton({ id }: { id: string }) {
	return (
		<select
			aria-busy="true"
			className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-muted-foreground text-sm outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30"
			disabled
			id={id}
		>
			<option>Loading rooms</option>
		</select>
	);
}
