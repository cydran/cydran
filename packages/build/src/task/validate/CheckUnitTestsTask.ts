import AbstractTask from "../AbstractTask.js";
import fs from "fs";
import path from "path";

const SUFFIX: string = ".ts";
const TEST_SUFFIX: string = ".spec.ts";

class CheckUnitTestsTask extends AbstractTask<any> {

	constructor() {
		super("CheckUnitTests");
	}

	public async execute(): Promise<void> {
		const srcPath: string = path.join(this.getConfig().getEnvironment().getRootPath(), "src");
		const testPath: string = path.join(this.getConfig().getEnvironment().getRootPath(), "test");

		console.log("Checking Unit Tests");

		let missingCount = 0;
		let totalCount = 0;
		
		this.walkDirectory(srcPath, (filePath) => {
			const name = filePath.toString().substring(4);
		
			if (!name.endsWith(SUFFIX)) {
				return;
			}
		
			++totalCount;
		
			const testName = testPath + "/" + name.slice(0, 0 - SUFFIX.length) + TEST_SUFFIX;
		
			if (!fs.existsSync(testName)) {
				console.log("Missing test for source file: " + name);
				++missingCount;
			}
		});
		
		const testedTotal = totalCount - missingCount;
		const percentage = (testedTotal / totalCount) * 100;
		
		if (missingCount > 0) {
			console.log();
			console.log("Total testable modules: " + totalCount);
			console.log("Total tested modules: " + testedTotal);
			console.log("Total missing tests: " + missingCount);
			console.log("Percentage of test coverage: " + percentage.toFixed(2) + "%");
			console.log();
		}
	}
	
	private walkDirectory(dir, callback): void {
		const files = fs.readdirSync(dir);
	
		for (const file of files) {
			const fullPath = path.join(dir, file);
			const stats = fs.statSync(fullPath);
	
			if (stats.isDirectory()) {
				this.walkDirectory(fullPath, callback);
			} else if (stats.isFile()) {
				callback(fullPath);
			}
		}
	}
	
}

export default CheckUnitTestsTask;
