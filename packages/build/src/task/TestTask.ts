import AbstractTask from "./AbstractTask";
import { run } from "jest-cli";
import path from "path";

class TestTask extends AbstractTask<any> {

	constructor() {
		super("Test");
	}

	public async execute(): Promise<void> {
		console.log("test Task run");

		const jestSetupPath = path.join(this.getConfig().getEnvironment().getAppRootPath(), "conf/jest.setup.ts");
		const tsConfigPath = path.join(this.getConfig().getEnvironment().getRootPath(), "tsconfig.json");
		const tsJestPath = path.join(this.getConfig().getEnvironment().getAppRootPath(), "node_modules/ts-jest");

		const config: any = {
			globals: {
				'ts-jest': {
					diagnostics: true
				}
			},
			clearMocks: true,
			collectCoverage: true,
			coverageDirectory: "coverage",
			rootDir: this.getConfig().getEnvironment().getRootPath(),
			roots: [
				"./test"
			],
			moduleDirectories: [
				"./dist",
				"./src",
				"./node_modules"
			],
			passWithNoTests: true,
			testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
			verbose: true,
			testEnvironment: "jsdom",
			setupFilesAfterEnv: [jestSetupPath],
			transform: {
				'^.+\\.tsx?$': [tsJestPath, { tsConfigPath }],
			},
		};

		await run(["--config", JSON.stringify(config)], this.getConfig().getEnvironment().getRootPath());

		// if (result.results.success) {
		// 	console.log(`Tests completed`);
		// } else {
		// 	console.error(`Tests failed`);
		// }

	}

}

export default TestTask;
