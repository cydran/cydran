import AbstractTask from "./AbstractTask";
import type { Config } from "@jest/types";
import { run } from "jest-cli";

class TestTask extends AbstractTask<any> {

	constructor() {
		super("Test");
	}

	public execute() {		
		console.log("test Task run");

		// Sync object
		const config: any = { // Config.ProjectConfig
			clearMocks: true,
			// collectCoverage: process.env.cover ? !!process.env.cover : false,
			// coverageDirectory: "coverage",
			rootDir: this.getConfig().getEnvironment().getRootPath(),
			roots: [
				"./test"
			],
			moduleDirectories: [
				"./dist",
				"./src",
				"./node_modules"
			],
			testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
			// verbose: true,
			testEnvironment: "jsdom",
			// setupFilesAfterEnv: ['./conf/jest.setup.js']
		};
		
		run(["--config", JSON.stringify(config)], this.getConfig().getEnvironment().getRootPath());

			// if (result.results.success) {
			// 	console.log(`Tests completed`);
			// } else {
			// 	console.error(`Tests failed`);
			// }

	}

}

export default TestTask;
