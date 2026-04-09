import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import reactComponentName from "react-scan/react-component-name/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	const plugins = [tailwindcss(), tanstackRouter({}), react()];

	if (mode === "development") {
		plugins.splice(2, 0, reactComponentName({}));
	}

	return {
		plugins,
		resolve: {
			alias: {
				"@": path.resolve(import.meta.dirname, "./src"),
			},
		},
		server: {
			port: 3001,
		},
	};
});
