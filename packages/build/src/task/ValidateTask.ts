import AbstractCompoundTask from "./AbstractCompoundTask.js";
import CheckDependenciesTask from "./validate/CheckDependenciesTask.js";
import CheckUnitTestsTask from "./validate/CheckUnitTestsTask.js";
import EsLintTask from "./validate/EsLintTask.js";
import LintPackageJsonTask from "./validate/LintPackageJsonTask.js";

const SUFFIX: string = ".ts";
const TEST_SUFFIX: string = ".spec.ts";

class ValidateTask extends AbstractCompoundTask {

	constructor() {
		super("Validate");
		this.add(new CheckUnitTestsTask());
		this.add(new CheckDependenciesTask());
		this.add(new LintPackageJsonTask());
		this.add(new EsLintTask());
	}
	
}

export default ValidateTask;
