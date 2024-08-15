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
	moduleNameMapper: {
		'^@cydran/(.*)$': '<rootDir>/../$1',
	}, 
	testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
	verbose: true,
	passWithNoTests: true,
	testEnvironment: "jsdom",
	// testEnvironment: "node",
	setupFilesAfterEnv: ['./conf/jest.setup.js']
};

export default config;