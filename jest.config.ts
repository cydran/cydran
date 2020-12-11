import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
	clearMocks: true,
	collectCoverage: process.env.cover ? !!process.env.cover : false,
	coverageDirectory: "coverage",
	roots: [
		process.env.integration ? "./integration" : "./test"
	],
	moduleDirectories: [
		"./src",
		"./node_modules",
		"./dist"
	],
	testMatch: process.env.integration
		? ["**/?(*.)+(integration-spec).[tj]s?(x)"]
		: ["**/?(*.)+(spec|test).[tj]s?(x)"],
	verbose: true
};

export default config;