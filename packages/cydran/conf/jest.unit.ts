import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
	clearMocks: true,
	collectCoverage: process.env.cover ? !! process.env.cover : false,
	coverageDirectory: "coverage",
	rootDir: "../",
	roots: [
		"./test"
	],
	moduleDirectories: [
		"./dist",
		"./src",
		"./node_modules"
	],
	testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
	verbose: false,
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ['./conf/jest.setup.js']
};

export default config;