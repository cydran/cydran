import AbstractTask from "../AbstractTask.js";
import { SECTION_NAME, INACTIVE_NOTICE } from "../../header/SourceHeadersConfig.js";
import { ScannedFile, SourceHeaderScan, scanIfActive, describe } from "../../header/SourceHeaderScan.js";

class CheckSourceHeadersTask extends AbstractTask<any> {

	constructor() {
		super("CheckSourceHeaders");
	}

	public async execute(): Promise<void> {
		const raw: any = this.getTaskConfig(SECTION_NAME);
		let scan: SourceHeaderScan;

		try {
			scan = scanIfActive(this.getConfig().getEnvironment().getRootPath(), raw);
		} catch (error) {
			console.error((error as Error).message);
			process.exit(1);
		}

		if (scan === null) {
			console.log(INACTIVE_NOTICE);
		} else {
			this.check(scan);
		}
	}

	private check(scan: SourceHeaderScan): void {
		const failures: ScannedFile[] = scan.files.filter((file) => file.analysis.classification !== "conforming");

		if (failures.length > 0) {
			for (const file of failures) {
				console.error(describe(file));
			}

			const unrecognized: number = failures.filter((file) => file.analysis.classification === "unrecognized").length;

			console.error(`\n${failures.length} of ${scan.files.length} files do not have the current source header (year ${scan.header.getYear()}).`);

			if (unrecognized < failures.length) {
				console.error("Run \"npm run fix\" to insert missing headers and update outdated years.");
			}

			if (unrecognized > 0) {
				console.error(`${unrecognized} unrecognized headers must be corrected by hand.`);
			}

			console.error();
			process.exit(1);
		} else {
			console.log(`All ${scan.files.length} files have the current source header.`);
		}
	}

}

export default CheckSourceHeadersTask;
