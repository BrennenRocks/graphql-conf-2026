import { useSuspenseFragment } from "@apollo/client/react";
import { Button } from "@graphql-conf/ui/components/button";
import { Input } from "@graphql-conf/ui/components/input";
import { Label } from "@graphql-conf/ui/components/label";
import { Loader2 } from "lucide-react";
import { useEffect, useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { graphql } from "@/__gql__";

interface RoomFormValues {
	description: string;
	name: string;
}

export const RoomFormFragment = graphql(/* GraphQL */ `
	fragment RoomForm_room on Room {
		id
		name
		description
	}
`);

interface BaseRoomFormProps {
	isSubmitting: boolean;
	onCancel?: () => void;
	onSubmit: (values: RoomFormValues) => Promise<void> | void;
	submitLabel: string;
}

type RoomFormProps =
	| (BaseRoomFormProps & {
			roomId: string;
	  })
	| (BaseRoomFormProps & {
			roomId?: never;
	  });

const emptyRoomFormValues = {
	description: "",
	name: "",
} satisfies RoomFormValues;

export function RoomForm(props: RoomFormProps) {
	if (props.roomId) {
		return <RoomEditForm {...props} roomId={props.roomId} />;
	}

	return <RoomFormFields {...props} defaultValues={emptyRoomFormValues} />;
}

function RoomEditForm({
	roomId,
	...props
}: BaseRoomFormProps & { roomId: string }) {
	const { data } = useSuspenseFragment({
		fragment: RoomFormFragment,
		from: {
			__typename: "Room",
			id: roomId,
		},
	});

	return (
		<RoomFormFields
			{...props}
			defaultValues={{
				description: data.description,
				name: data.name,
			}}
		/>
	);
}

function RoomFormFields({
	defaultValues,
	isSubmitting,
	onCancel,
	onSubmit,
	submitLabel,
}: BaseRoomFormProps & { defaultValues: RoomFormValues }) {
	const id = useId();
	const { description: defaultDescription, name: defaultName } = defaultValues;
	const {
		formState: { isSubmitting: isFormSubmitting },
		handleSubmit,
		register,
		reset,
		watch,
	} = useForm<RoomFormValues>({
		defaultValues,
	});
	const description = watch("description");
	const name = watch("name");
	const isDisabled = isSubmitting || isFormSubmitting;
	const trimmedDescription = description.trim();
	const trimmedName = name.trim();
	const canSubmit = Boolean(trimmedDescription && trimmedName && !isDisabled);
	const descriptionField = register("description", {
		validate: (value) => value.trim().length > 0,
	});
	const nameField = register("name", {
		validate: (value) => value.trim().length > 0,
	});

	useEffect(() => {
		reset({
			description: defaultDescription,
			name: defaultName,
		});
	}, [defaultDescription, defaultName, reset]);

	const handleValidSubmit: SubmitHandler<RoomFormValues> = async (values) => {
		const nextDescription = values.description.trim();
		const nextName = values.name.trim();

		if (!(nextDescription && nextName)) {
			return;
		}

		await Promise.resolve(
			onSubmit({
				description: nextDescription,
				name: nextName,
			})
		).catch(() => undefined);
	};

	return (
		<form className="grid gap-3" onSubmit={handleSubmit(handleValidSubmit)}>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-room-name`}>Name</Label>
				<Input
					disabled={isDisabled}
					id={`${id}-room-name`}
					placeholder="Sunroom"
					{...nameField}
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-room-description`}>Description</Label>
				<textarea
					className="min-h-16 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30"
					disabled={isDisabled}
					id={`${id}-room-description`}
					placeholder="Bright afternoon light with space for shelves."
					{...descriptionField}
				/>
			</div>
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
