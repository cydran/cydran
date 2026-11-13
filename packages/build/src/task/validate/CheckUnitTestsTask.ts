import AbstractTask from "../AbstractTask.js";
import Common from "../../config/Common.js";
import { SECTION_NAME, INACTIVE_NOTICE } from "../../unittest/UnitTestsConfig.js";
import { SourceFile, TestFile, UnitTestScan, scanIfActive } from "../../unittest/UnitTestScan.js";

type Writer = (...data: any[]) => void;

class CheckUnitTestsTask extends AbstractTask<any> {

	constructor() {
		super("CheckUnitTests");
	}

	public async execute(): Promise<void> {
		const raw: any = this.getTaskConfig(SECTION_NAME);
		const common: Common = this.getConfig().getCommon();
		let scan: UnitTestScan = null;
		let failed: boolean = false;

		try {
			scan = scanIfActive(this.getConfig().getEnvironment().getRootPath(), common.getSrcPath(), common.getTestPath(), raw);
		} catch (error) {
			console.error((error as Error).message);
			failed = true;
		}

		if (failed) {
			process.exit(1);
		} else if (scan === null) {
			console.log(INACTIVE_NOTICE);
		} else {
			this.check(scan);
		}
	}

	private check(scan: UnitTestScan): void {
		const missing: SourceFile[] = scan.sources.filter((source) => !source.tested);
		const orphaned: TestFile[] = scan.tests.filter((test) => test.orphaned);
		const failOnMissing: boolean = scan.config.failOnMissing && missing.length > 0;
		const failOnOrphaned: boolean = scan.config.failOnOrphaned && orphaned.length > 0;

		this.reportMissing(scan.sources, missing, failOnMissing ? console.error : console.log);
		this.reportOrphaned(scan.tests, orphaned, failOnOrphaned ? console.error : console.log);

		if (failOnMissing) {
			console.error(`Failing because ${SECTION_NAME}.failOnMissing is true.`);
		}

		if (failOnOrphaned) {
			console.error(`Failing because ${SECTION_NAME}.failOnOrphaned is true.`);
		}

		if (failOnMissing || failOnOrphaned) {
			console.error();
			process.exit(1);
		}
	}

	private reportMissing(sources: SourceFile[], missing: SourceFile[], write: Writer): void {
		if (missing.length > 0) {
			const tested: number = sources.length - missing.length;
			const percentage: number = (tested / sources.length) * 100;

			for (const source of missing) {
				write(`${source.path}: missing unit test (expected ${source.expectedTest})`);
			}

			write();
			write(`Checked source files: ${sources.length}`);
			write(`Tested: ${tested}`);
			write(`Missing a unit test: ${missing.length}`);
			write(`Percentage tested: ${percentage.toFixed(2)}%`);
			write();
		} else {
			console.log(`All ${sources.length} checked source files have a unit test.`);
		}
	}

	private reportOrphaned(tests: TestFile[], orphaned: TestFile[], write: Writer): void {
		if (orphaned.length > 0) {
			for (const test of orphaned) {
				write(`${test.path}: orphaned unit test (no source file at ${test.expectedSource})`);
			}

			write();
			write(`Examined unit tests: ${tests.length}`);
			write(`Orphaned: ${orphaned.length}`);
			write();
		} else {
			console.log(`No orphaned unit tests among ${tests.length} examined.`);
		}
	}

}

export default CheckUnitTestsTask;
