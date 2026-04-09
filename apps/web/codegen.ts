import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	documents: ["src/**/*.{ts,tsx}", "!src/__gql__/**/*"],
	generates: {
		"./src/__gql__/": {
			config: {
				avoidOptionals: false,
				dedupeFragments: true,
				enumsAsConst: true,
				nonOptionalTypename: true,
				useTypeImports: true,
			},
			preset: "client",
			presetConfig: {
				fragmentMasking: true,
			},
		},
		"./src/__gql__/apollo-helpers.ts": {
			config: {
				useTypeImports: true,
			},
			plugins: ["typescript-apollo-client-helpers"],
		},
	},
	ignoreNoDocuments: true,
	schema: [
		{
			"../../packages/api/src/schema.ts": {
				noRequire: true,
			},
		},
	],
};

export default config;
