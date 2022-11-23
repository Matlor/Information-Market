import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import * as path from "path";

export default defineConfig({
	e2e: {
		setupNodeEvents(on) {
			on(
				"file:preprocessor",
				vitePreprocessor(path.resolve("./vite.config.ts"))
			);
		},
		baseUrl: "http://localhost:3000",
	},
	// http://localhost:8000/?canisterId=renrk-eyaaa-aaaaa-aaada-cai

	component: {
		devServer: {
			framework: "react",
			bundler: "vite",
		},
	},
});
// specPattern: "**/*.cy.ts",
