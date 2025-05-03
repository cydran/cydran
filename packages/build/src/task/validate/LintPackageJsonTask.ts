import { OverallLintingResult } from "npm-package-json-lint/dist/src/linter/linter.js";
import AbstractTask from "../AbstractTask.js";
import { LintIssue, NpmPackageJsonLint, PackageJsonFileLintingResult } from "npm-package-json-lint";
import path from 'path';

class LintPackageJsonTask extends AbstractTask<any> {

	constructor() {
		super("LintPackageJson");
	}

	public async execute(): Promise<void> {
		const rules: any = this.getTaskConfig("lint-package-json-rules");

		const linter: NpmPackageJsonLint = new NpmPackageJsonLint({
			cwd: this.getConfig().getEnvironment().getRootPath(),
			config: {
				rules: rules
			},
			patterns: ["."],
			ignorePath: "",
			quiet: false,
		});

		const output: OverallLintingResult = linter.lint();

		if (output.errorCount > 0) {
			console.error("package.json linting errors found:\n");

			output.results.forEach((result: PackageJsonFileLintingResult) => {
				result.issues.forEach((issue: LintIssue) => {
					console.error(issue.toString());
				});
			});

			console.log("\n");
			process.exit(1);
		} else if (output.warningCount > 0) {
			console.warn("package.json linting warnings found:\n");

			output.results.forEach((result: PackageJsonFileLintingResult) => {
				result.issues.forEach((issue: LintIssue) => {
					console.error(issue.toString());
				});
			});

			console.log("\n");
		} else {
			console.log("\nNo package.json issues found.\n");
		}
	}
		
}

export default LintPackageJsonTask;
