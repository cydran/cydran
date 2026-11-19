import AbstractTask from "../AbstractTask.js";
import { SECTION_NAME, INACTIVE_NOTICE } from "../../format/FormatConfig.js";
import { FormattedFile, FormatScan, scanIfActive } from "../../format/FormatScan.js";

class CheckFormattingTask extends AbstractTask<any> {

	constructor() {
		super("CheckFormatting");
	}

	public async execute(): Promise<void> {
		const raw: any = this.getTaskConfig(SECTION_NAME);
		let scan: FormatScan = null;
		let failed: boolean = false;

		try {
			scan = await scanIfActive(this.getConfig().getEnvironment().getRootPath(), raw);
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

	private check(scan: FormatScan): void {
		const unformatted: FormattedFile[] = scan.files.filter((file) => file.changed);
		const unformattable: FormattedFile[] = scan.files.filter((file) => file.error !== null);

		if (unformatted.length > 0 || unformattable.length > 0) {
			for (const file of unformatted) {
				console.error(`${file.path}: not formatted`);
			}

			for (const file of unformattable) {
				console.error(`${file.path}: cannot be formatted: ${file.error}`);
			}

			console.error();
			console.error(`Checked files: ${scan.files.length}`);
			console.error(`Not formatted: ${unformatted.length}`);

			if (unformattable.length > 0) {
				console.error(`Cannot be formatted: ${unformattable.length}`);
			}

			if (unformatted.length > 0) {
				console.error("Run \"npm run format\" to format them.");
			}

			console.error();
			process.exit(1);
		} else {
			console.log(`All ${scan.files.length} checked files are formatted.`);
		}
	}

}

export default CheckFormattingTask;
