import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { plant, room } from "./schema/rooms";

dotenv.config({
	path: "../../apps/server/.env",
});

const seedRooms = [
	{
		description: "A bright gathering room with steady indirect light.",
		id: "00000000-0000-4000-8000-000000000001",
		name: "Living Room",
		plants: [
			{
				id: "00000000-0000-4000-8000-000000000101",
				name: "Monstera",
				species: "Monstera deliciosa",
			},
			{
				id: "00000000-0000-4000-8000-000000000102",
				name: "Snake Plant",
				species: "Dracaena trifasciata",
			},
		],
	},
	{
		description: "A calm workspace with morning sun near the desk.",
		id: "00000000-0000-4000-8000-000000000002",
		name: "Office",
		plants: [
			{
				id: "00000000-0000-4000-8000-000000000201",
				name: "Pothos",
				species: "Epipremnum aureum",
			},
			{
				id: "00000000-0000-4000-8000-000000000202",
				name: "ZZ Plant",
				species: "Zamioculcas zamiifolia",
			},
		],
	},
	{
		description: "A humid room that works well for moisture-loving plants.",
		id: "00000000-0000-4000-8000-000000000003",
		name: "Bathroom",
		plants: [
			{
				id: "00000000-0000-4000-8000-000000000301",
				name: "Bird's Nest Fern",
				species: "Asplenium nidus",
			},
		],
	},
	{
		description: "A warm cooking space with a sunny windowsill.",
		id: "00000000-0000-4000-8000-000000000004",
		name: "Kitchen",
		plants: [
			{
				id: "00000000-0000-4000-8000-000000000401",
				name: "Basil",
				species: "Ocimum basilicum",
			},
			{
				id: "00000000-0000-4000-8000-000000000402",
				name: "Aloe",
				species: "Aloe vera",
			},
		],
	},
	{
		description: "A quiet sleeping space with soft filtered light.",
		id: "00000000-0000-4000-8000-000000000005",
		name: "Bedroom",
		plants: [
			{
				id: "00000000-0000-4000-8000-000000000501",
				name: "Peace Lily",
				species: "Spathiphyllum wallisii",
			},
		],
	},
] as const;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is required to seed the database.");
}

const pool = new Pool({
	connectionString: databaseUrl,
});

const db = drizzle(pool);

const formatError = (error: unknown): string => {
	if (error instanceof AggregateError) {
		return error.errors.map(formatError).join("\n");
	}

	if (error instanceof Error) {
		const causeText = error.cause ? `\nCause: ${formatError(error.cause)}` : "";

		return `${error.stack ?? error.message}${causeText}`;
	}

	return String(error);
};

try {
	let plantCount = 0;

	for (const seedRoom of seedRooms) {
		const [savedRoom] = await db
			.insert(room)
			.values({
				description: seedRoom.description,
				id: seedRoom.id,
				name: seedRoom.name,
			})
			.onConflictDoUpdate({
				set: {
					description: seedRoom.description,
				},
				target: room.name,
			})
			.returning({
				id: room.id,
			});

		if (!savedRoom) {
			throw new Error(`Unable to seed room: ${seedRoom.name}`);
		}

		for (const seedPlant of seedRoom.plants) {
			await db
				.insert(plant)
				.values({
					id: seedPlant.id,
					name: seedPlant.name,
					roomId: savedRoom.id,
					species: seedPlant.species,
				})
				.onConflictDoUpdate({
					set: {
						name: seedPlant.name,
						roomId: savedRoom.id,
						species: seedPlant.species,
					},
					target: plant.id,
				});

			plantCount += 1;
		}
	}

	process.stdout.write(
		`Seeded ${seedRooms.length} rooms and ${plantCount} plants.\n`
	);
} catch (error) {
	process.stderr.write(`${formatError(error)}\n`);
	process.exitCode = 1;
} finally {
	await pool.end();
}
