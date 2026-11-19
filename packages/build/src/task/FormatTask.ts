import fs from "fs";
import path from "path";
import AbstractTask from "./AbstractTask.js";
import { YES_OPTION, confirm } from "../Confirm.js";
import { SECTION_NAME, INACTIVE_NOTICE } from "../format/FormatConfig.js";
import { FormattedFile, FormatScan, scanIfActive } from "../format/FormatScan.js";

class FormatTask extends AbstractTask<any> {

	constructor() {
		super("Format");
	}

	public getSupportedOptions(): string[] {
		return [YES_OPTION];
	}

	public async execute(): Promise<void> {
		const packageRoot: string = this.getConfig().getEnvironment().getRootPath();
		const raw: any = this.getTaskConfig(SECTION_NAME);
		let scan: FormatScan = null;
		let failed: boolean = false;

		try {
			scan = await scanIfActive(packageRoot, raw);
		} catch (error) {
			console.error((error as Error).message);
			failed = true;
		}

		if (failed) {
			process.exit(1);
		} else if (scan === null) {
			console.log(INACTIVE_NOTICE);
		} else {
			await this.format(packageRoot, scan);
		}
	}

	private async format(packageRoot: string, scan: FormatScan): Promise<void> {
		const toFormat: FormattedFile[] = scan.files.filter((file) => file.changed);
		const unformattable: FormattedFile[] = scan.files.filter((file) => file.error !== null);

		console.log(`Files checked: ${scan.files.length}`);
		this.printGroup("Will be formatted", toFormat, (file) => file.path);
		this.printGroup("Cannot be formatted, left unchanged", unformattable, (file) => `${file.path}: ${file.error}`);

		if (toFormat.length === 0 && unformattable.length === 0) {
			console.log(`\nAll ${scan.files.length} files are already formatted.`);
		} else if (toFormat.length === 0) {
			console.log("\nNothing to format.");
		} else if (await confirm("format", `${toFormat.length} files will be modified in place.`, this.getConfig().getOptions().has(YES_OPTION))) {
			for (const file of toFormat) {
				fs.writeFileSync(path.join(packageRoot, file.path), file.formatted, "utf8");
			}

			console.log(`\nFormatted ${toFormat.length} files.`);
		}

		if (unformattable.length > 0) {
			console.error(`\n${unformattable.length} files could not be formatted.`);
			process.exit(1);
		}
	}

	private printGroup(title: string, files: FormattedFile[], formatFn: (file: FormattedFile) => string): void {
		if (files.length > 0) {
			console.log(`\n${title} (${files.length}):`);

			for (const file of files) {
				console.log(`  ${formatFn(file)}`);
			}
		}
	}

}

export default FormatTask;
