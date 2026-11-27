import AbstractTask from "./AbstractTask.js";
import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { SECTION_NAME, readCleanPaths } from "../clean/CleanConfig.js";

class CleanTask extends AbstractTask<any> {

	constructor() {
		super("Clean");
	}

	public async execute(): Promise<void> {
		const packageRoot: string = this.getConfig().getEnvironment().getRootPath();
		const common = this.getConfig().getCommon();
		const paths: string[] = readCleanPaths(this.getTaskConfig(SECTION_NAME), packageRoot, common.getDistPath(), common.getWorkPath());
		const matches: string[] = fg.sync(paths, { cwd: packageRoot, onlyFiles: false, followSymbolicLinks: false }).sort();

		for (const match of matches) {
			const matchPath: string = path.resolve(packageRoot, match);

			if (fs.existsSync(matchPath)) {
				fs.rmSync(matchPath, { recursive: true, force: true });
				this.print("Removed: " + match);
			}
		}

		if (matches.length === 0) {
			this.print("Nothing to remove");
		}
	}

}

export default CleanTask;
