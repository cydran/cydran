import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
	clearMocks: true,
	collectCoverage: false,
	coverageDirectory: "coverage",
	rootDir: "./",
	roots: [
		"./integration"
	],
	moduleDirectories: [
		"./dist",
		// "./src",
		"./node_modules"
	],
	testMatch: ["**/?(*.)+(integration-spec).[tj]s?(x)"],
	verbose: true,
	testEnvironment: "jsdom"
};

export default config;