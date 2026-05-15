import { useSuspenseQuery } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import { Input } from "@graphql-conf/ui/components/input";
import { Label } from "@graphql-conf/ui/components/label";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useId } from "react";
import {
	type SubmitHandler,
	type UseFormRegisterReturn,
	useForm,
} from "react-hook-form";

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
	const {
		name: defaultName,
		roomId: defaultRoomId,
		species: defaultSpecies,
	} = defaultValues;
	const {
		formState: { isSubmitting: isFormSubmitting },
		handleSubmit,
		register,
		reset,
		watch,
	} = useForm<PlantFormValues>({
		defaultValues,
	});
	const name = watch("name");
	const roomId = watch("roomId");
	const species = watch("species");
	const isDisabled = isSubmitting || isFormSubmitting;
	const trimmedName = name.trim();
	const trimmedSpecies = species.trim();
	const canSubmit = Boolean(
		trimmedName && trimmedSpecies && roomId && !isDisabled
	);
	const nameField = register("name", {
		validate: (value) => value.trim().length > 0,
	});
	const roomIdField = register("roomId", {
		validate: (value) => value.trim().length > 0,
	});
	const speciesField = register("species", {
		validate: (value) => value.trim().length > 0,
	});

	useEffect(() => {
		reset({
			name: defaultName,
			roomId: defaultRoomId,
			species: defaultSpecies,
		});
	}, [defaultName, defaultRoomId, defaultSpecies, reset]);

	const handleValidSubmit: SubmitHandler<PlantFormValues> = async (values) => {
		const nextName = values.name.trim();
		const nextSpecies = values.species.trim();

		if (!(nextName && nextSpecies && values.roomId)) {
			return;
		}

		await Promise.resolve(
			onSubmit({
				name: nextName,
				roomId: values.roomId,
				species: nextSpecies,
			})
		).catch(() => undefined);
	};

	return (
		<form className="grid gap-3" onSubmit={handleSubmit(handleValidSubmit)}>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-plant-name`}>Name</Label>
				<Input
					disabled={isDisabled}
					id={`${id}-plant-name`}
					placeholder="Monstera"
					{...nameField}
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-plant-species`}>Species</Label>
				<Input
					disabled={isDisabled}
					id={`${id}-plant-species`}
					placeholder="Monstera deliciosa"
					{...speciesField}
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
							isDisabled={isDisabled || isRoomSelectDisabled}
							registration={roomIdField}
						/>
					</Suspense>
					{roomSelectError ? (
						<p className="text-destructive text-xs">{roomSelectError}</p>
					) : null}
				</div>
			) : (
				<input type="hidden" {...roomIdField} />
			)}
			<div className="flex flex-wrap justify-end gap-2">
				{onCancel ? (
					<Button
						disabled={isDisabled}
						onClick={onCancel}
						type="button"
						variant="outline"
					>
						Cancel
					</Button>
				) : null}
				<Button disabled={!canSubmit} type="submit">
					{isDisabled ? <Loader2 className="animate-spin" /> : null}
					{submitLabel}
				</Button>
			</div>
		</form>
	);
}

interface PlantRoomSelectProps {
	id: string;
	isDisabled: boolean;
	registration: UseFormRegisterReturn<"roomId">;
}

function PlantRoomSelect({
	id,
	isDisabled,
	registration,
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
			{...registration}
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
