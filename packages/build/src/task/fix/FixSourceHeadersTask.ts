import fs from "fs";
import path from "path";
import AbstractTask from "../AbstractTask.js";
import { YES_OPTION, confirm } from "../../Confirm.js";
import { SECTION_NAME, INACTIVE_NOTICE } from "../../header/SourceHeadersConfig.js";
import { ScannedFile, SourceHeaderScan, scanIfActive } from "../../header/SourceHeaderScan.js";

class FixSourceHeadersTask extends AbstractTask<any> {

	constructor() {
		super("FixSourceHeaders");
	}

	public getSupportedOptions(): string[] {
		return [YES_OPTION];
	}

	public async execute(): Promise<void> {
		const packageRoot: string = this.getConfig().getEnvironment().getRootPath();
		const raw: any = this.getTaskConfig(SECTION_NAME);
		let scan: SourceHeaderScan;

		try {
			scan = scanIfActive(packageRoot, raw);
		} catch (error) {
			console.error((error as Error).message);
			process.exit(1);
		}

		if (scan === null) {
			console.log(INACTIVE_NOTICE);
		} else {
			await this.fix(packageRoot, scan);
		}
	}

	private async fix(packageRoot: string, scan: SourceHeaderScan): Promise<void> {
		const inserts: ScannedFile[] = this.withClassification(scan, "missing");
		const updates: ScannedFile[] = this.withClassification(scan, "outdated");
		const unrecognized: ScannedFile[] = this.withClassification(scan, "unrecognized");
		const toModify: ScannedFile[] = inserts.concat(updates);

		console.log(`Header file: ${scan.config.headerFile} (year ${scan.header.getYear()})`);
		console.log(`Files checked: ${scan.files.length}`);
		this.printGroup("Insert header", inserts, (file) => file.path);
		this.printGroup(`Update year to ${scan.header.getYear()}`, updates, (file) => `${file.path} (${file.analysis.foundYear})`);
		this.printGroup("Unrecognized header, left unchanged (fix by hand)", unrecognized, (file) => file.path);

		if (toModify.length === 0) {
			console.log("\nNothing to fix.");
		} else if (await confirm("fix", `${toModify.length} files will be modified in place.`, this.getConfig().getOptions().has(YES_OPTION))) {
			for (const file of toModify) {
				const filePath: string = path.join(packageRoot, file.path);
				fs.writeFileSync(filePath, scan.header.apply(fs.readFileSync(filePath, "utf8")), "utf8");
			}

			console.log(`\nModified ${toModify.length} files: ${inserts.length} headers inserted, ${updates.length} years updated.`);
		}
	}

	private withClassification(scan: SourceHeaderScan, classification: string): ScannedFile[] {
		return scan.files.filter((file) => file.analysis.classification === classification);
	}

	private printGroup(title: string, files: ScannedFile[], formatFn: (file: ScannedFile) => string): void {
		if (files.length > 0) {
			console.log(`\n${title} (${files.length}):`);

			for (const file of files) {
				console.log(`  ${formatFn(file)}`);
			}
		}
	}

}

export default FixSourceHeadersTask;
