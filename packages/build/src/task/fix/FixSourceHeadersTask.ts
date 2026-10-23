import fs from "fs";
import path from "path";
import readline from "readline/promises";
import AbstractTask from "../AbstractTask.js";
import { SECTION_NAME, INACTIVE_NOTICE } from "../../header/SourceHeadersConfig.js";
import { ScannedFile, SourceHeaderScan, scanIfActive } from "../../header/SourceHeaderScan.js";

const YES_OPTION: string = "yes";

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
		} else if (await this.confirm(`${toModify.length} files will be modified in place.`)) {
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

	private async confirm(message: string): Promise<boolean> {
		let proceed: boolean = false;

		if (this.getConfig().getOptions().has(YES_OPTION)) {
			console.log(`\n${message} Proceeding (--yes).`);
			proceed = true;
		} else if (process.stdin.isTTY) {
			proceed = await this.ask(message);
		} else {
			console.error(`\n${message} No changes made: fix requires an interactive terminal or --yes.`);
			process.exit(1);
		}

		return proceed;
	}

	private async ask(message: string): Promise<boolean> {
		const prompt: readline.Interface = readline.createInterface({ input: process.stdin, output: process.stdout });
		let proceed: boolean = false;

		try {
			const answer: string = (await prompt.question(`\n${message} Proceed? [y/N] `)).trim().toLowerCase();
			proceed = answer === "y" || answer === "yes";

			if (!proceed) {
				console.log("No changes made.");
			}
		} finally {
			prompt.close();
		}

		return proceed;
	}

}

export default FixSourceHeadersTask;
