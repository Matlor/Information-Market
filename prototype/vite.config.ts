import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// gets canister Ids to use as env variables
// add port

export default defineConfig({
	// add env variables
	// add optimizeDeps

	plugins: [react()],
	root: "frontend",

	// add resolve
	// add proxy
	// add build version
});

// https://vitejs.dev/config/
