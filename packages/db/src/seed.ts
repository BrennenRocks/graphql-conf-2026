import dotenv from "dotenv";
import { like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { plant, room } from "./schema/rooms";

dotenv.config({
	path: "../../apps/server/.env",
});

const DEFAULT_ROOM_COUNT = 5;
const DEFAULT_PLANT_COUNT = 8;
const PLANT_ID_OFFSET = 100_000;
const SEED_ID_PREFIX = "00000000-0000-4000-8000-";
const SEED_ID_PATTERN = `${SEED_ID_PREFIX}%`;
const NON_NEGATIVE_INTEGER_PATTERN = /^\d+$/;

interface SeedPlant {
	id: string;
	name: string;
	species: string;
}

interface SeedRoom {
	description: string;
	id: string;
	lightProfile: string;
	name: string;
	plants: SeedPlant[];
}

const defaultSeedRooms = [
	{
		description: "A bright gathering room with steady indirect light.",
		id: "00000000-0000-4000-8000-000000000001",
		lightProfile: "Bright indirect light",
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
		lightProfile: "Morning sun",
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
		lightProfile: "Humid filtered light",
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
		lightProfile: "Sunny windowsill",
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
		lightProfile: "Soft filtered light",
		name: "Bedroom",
		plants: [
			{
				id: "00000000-0000-4000-8000-000000000501",
				name: "Peace Lily",
				species: "Spathiphyllum wallisii",
			},
		],
	},
] as const satisfies readonly SeedRoom[];

const roomTemplates = [
	{
		description: "A bright gathering room with steady indirect light.",
		lightProfile: "Bright indirect light",
		name: "Living Room",
	},
	{
		description: "A calm workspace with morning sun near the desk.",
		lightProfile: "Morning sun",
		name: "Office",
	},
	{
		description: "A humid room that works well for moisture-loving plants.",
		lightProfile: "Humid filtered light",
		name: "Bathroom",
	},
	{
		description: "A warm cooking space with a sunny windowsill.",
		lightProfile: "Sunny windowsill",
		name: "Kitchen",
	},
	{
		description: "A quiet sleeping space with soft filtered light.",
		lightProfile: "Soft filtered light",
		name: "Bedroom",
	},
	{
		description: "A compact room with flexible light for hardy plants.",
		lightProfile: "Flexible indirect light",
		name: "Plant Room",
	},
	{
		description: "A glassy corner room with strong afternoon brightness.",
		lightProfile: "Afternoon direct light",
		name: "Sunroom",
	},
	{
		description: "A sheltered entry space with short bursts of daylight.",
		lightProfile: "Low indirect light",
		name: "Entryway",
	},
	{
		description: "A quiet reading nook with a north-facing window.",
		lightProfile: "Cool north light",
		name: "Library",
	},
	{
		description: "A finished basement room with stable temperatures.",
		lightProfile: "Supplemental grow light",
		name: "Basement",
	},
	{
		description: "A laundry area with warm air and occasional humidity.",
		lightProfile: "Warm filtered light",
		name: "Laundry Room",
	},
	{
		description: "A dining space with bright midday exposure.",
		lightProfile: "Midday bright light",
		name: "Dining Room",
	},
	{
		description: "A hallway landing with gentle ambient light.",
		lightProfile: "Gentle ambient light",
		name: "Landing",
	},
	{
		description: "A nursery corner with soft curtains and calm airflow.",
		lightProfile: "Diffused curtain light",
		name: "Nursery",
	},
	{
		description: "A studio space with broad windows and dry air.",
		lightProfile: "Bright west light",
		name: "Studio",
	},
	{
		description: "A guest room with steady shade through the afternoon.",
		lightProfile: "Steady shaded light",
		name: "Guest Room",
	},
	{
		description: "A breakfast area with quick morning brightness.",
		lightProfile: "East-facing morning light",
		name: "Breakfast Nook",
	},
	{
		description: "A mudroom with cooler drafts near the back door.",
		lightProfile: "Cool low light",
		name: "Mudroom",
	},
	{
		description: "A loft with high ceilings and changing daylight.",
		lightProfile: "Variable overhead light",
		name: "Loft",
	},
	{
		description: "A porch room protected from harsh sun and wind.",
		lightProfile: "Covered porch light",
		name: "Porch",
	},
] as const;

const plantTemplates = [
	{
		name: "Monstera",
		species: "Monstera deliciosa",
	},
	{
		name: "Snake Plant",
		species: "Dracaena trifasciata",
	},
	{
		name: "Pothos",
		species: "Epipremnum aureum",
	},
	{
		name: "ZZ Plant",
		species: "Zamioculcas zamiifolia",
	},
	{
		name: "Bird's Nest Fern",
		species: "Asplenium nidus",
	},
	{
		name: "Basil",
		species: "Ocimum basilicum",
	},
	{
		name: "Aloe",
		species: "Aloe vera",
	},
	{
		name: "Peace Lily",
		species: "Spathiphyllum wallisii",
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

const createSeedId = (value: number): string => {
	return `${SEED_ID_PREFIX}${value.toString().padStart(12, "0")}`;
};

const parseSeedCount = (flag: string, value: string | undefined): number => {
	if (!value || value.startsWith("--")) {
		throw new Error(`${flag} requires a count value.`);
	}

	if (!NON_NEGATIVE_INTEGER_PATTERN.test(value)) {
		throw new Error(`${flag} must be a non-negative integer.`);
	}

	const parsedValue = Number(value);

	if (!Number.isSafeInteger(parsedValue)) {
		throw new Error(`${flag} is too large.`);
	}

	return parsedValue;
};

const parseSeedOptions = (
	args: string[]
): { customCounts: boolean; plantCount: number; roomCount: number } => {
	let plantCount = DEFAULT_PLANT_COUNT;
	let roomCount = DEFAULT_ROOM_COUNT;
	let customCounts = false;

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		if (!arg) {
			continue;
		}

		const [flag, inlineValue] = arg.split("=", 2);

		if (flag === "--rooms") {
			const value = inlineValue ?? args[index + 1];
			roomCount = parseSeedCount(flag, value);
			customCounts = true;

			if (!inlineValue) {
				index += 1;
			}

			continue;
		}

		if (flag === "--plants") {
			const value = inlineValue ?? args[index + 1];
			plantCount = parseSeedCount(flag, value);
			customCounts = true;

			if (!inlineValue) {
				index += 1;
			}

			continue;
		}

		throw new Error(`Unknown seed option: ${arg}`);
	}

	if (roomCount === 0 && plantCount > 0) {
		throw new Error("Cannot seed plants when --rooms is 0.");
	}

	return {
		customCounts,
		plantCount,
		roomCount,
	};
};

const getRoomTemplate = (index: number) => {
	return roomTemplates[index % roomTemplates.length];
};

const getPlantTemplate = (index: number) => {
	return plantTemplates[index % plantTemplates.length];
};

const createPlantName = (index: number): string => {
	const template = getPlantTemplate(index);

	if (index < plantTemplates.length) {
		return template.name;
	}

	return `${template.name} ${index + 1}`;
};

const buildGeneratedSeedRooms = ({
	plantCount,
	roomCount,
}: {
	plantCount: number;
	roomCount: number;
}): SeedRoom[] => {
	if (roomCount === 0) {
		return [];
	}

	const basePlantCount = Math.floor(plantCount / roomCount);
	const roomsWithExtraPlant = plantCount % roomCount;
	let nextPlantIndex = 0;

	return Array.from({ length: roomCount }, (_, roomIndex) => {
		const template = getRoomTemplate(roomIndex);

		if (!template) {
			throw new Error(`Unable to build seed room ${roomIndex + 1}.`);
		}

		const roomPlantCount =
			basePlantCount + (roomIndex < roomsWithExtraPlant ? 1 : 0);
		const plants = Array.from({ length: roomPlantCount }, () => {
			const plantIndex = nextPlantIndex;
			const plantTemplate = getPlantTemplate(plantIndex);
			nextPlantIndex += 1;

			return {
				id: createSeedId(PLANT_ID_OFFSET + plantIndex + 1),
				name: createPlantName(plantIndex),
				species: plantTemplate.species,
			};
		});

		return {
			description: template.description,
			id: createSeedId(roomIndex + 1),
			lightProfile: template.lightProfile,
			name:
				roomIndex < roomTemplates.length - 1
					? template.name
					: `${template.name} ${roomIndex + 1}`,
			plants,
		};
	});
};

const buildSeedRooms = ({
	customCounts,
	plantCount,
	roomCount,
}: {
	customCounts: boolean;
	plantCount: number;
	roomCount: number;
}): readonly SeedRoom[] => {
	if (!customCounts) {
		return defaultSeedRooms;
	}

	return buildGeneratedSeedRooms({
		plantCount,
		roomCount,
	});
};

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
	const seedOptions = parseSeedOptions(process.argv.slice(2));
	const seedRooms = buildSeedRooms(seedOptions);
	const seedPlants = seedRooms.flatMap((seedRoom) => {
		return seedRoom.plants.map((seedPlant) => ({
			...seedPlant,
			roomId: seedRoom.id,
		}));
	});

	await db.transaction(async (tx) => {
		await tx.delete(plant).where(like(plant.id, SEED_ID_PATTERN));
		await tx.delete(room).where(like(room.id, SEED_ID_PATTERN));

		if (seedRooms.length > 0) {
			await tx.insert(room).values(
				seedRooms.map((seedRoom) => ({
					description: seedRoom.description,
					id: seedRoom.id,
					lightProfile: seedRoom.lightProfile,
					name: seedRoom.name,
				}))
			);
		}

		if (seedPlants.length > 0) {
			await tx.insert(plant).values(seedPlants);
		}
	});

	process.stdout.write(
		`Seeded ${seedRooms.length} rooms and ${seedPlants.length} plants.\n`
	);
} catch (error) {
	process.stderr.write(`${formatError(error)}\n`);
	process.exitCode = 1;
} finally {
	await pool.end();
}
