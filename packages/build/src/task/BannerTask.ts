import fs from "fs";
import path from "path";
import AbstractTask from "./AbstractTask.js";
import { SECTION_NAME, INACTIVE_NOTICE, isActive, readBannerConfig, BannerConfig } from "../banner/BannerConfig.js";
import { createBanner, prependBanner } from "../banner/Banner.js";

class BannerTask extends AbstractTask<any> {

	constructor() {
		super("Banner");
	}

	public async execute(): Promise<void> {
		const raw: any = this.getTaskConfig(SECTION_NAME);
		let config: BannerConfig = null;

		try {
			if (isActive(raw)) {
				config = readBannerConfig(raw);
			}
		} catch (error) {
			console.error((error as Error).message);
			process.exit(1);
		}

		if (config === null) {
			console.log(INACTIVE_NOTICE);
		} else {
			this.addBanners(this.getConfig().getEnvironment().getRootPath(), config);
		}
	}

	private addBanners(packageRoot: string, config: BannerConfig): void {
		const sourcePath: string = path.resolve(packageRoot, config.source);
		const targetPaths: string[] = config.targets.map((target) => path.resolve(packageRoot, target));
		const missing: string[] = [sourcePath].concat(targetPaths).filter((filePath) => !fs.existsSync(filePath));

		if (missing.length > 0) {
			for (const filePath of missing) {
				console.error(`Banner file not found: ${filePath}`);
			}

			process.exit(1);
		} else {
			const version: string = JSON.parse(fs.readFileSync(path.resolve(packageRoot, "package.json"), "utf8"))["version"];
			const year: number = new Date().getFullYear();
			const banner: string = createBanner(version, fs.readFileSync(sourcePath, "utf8"), year);

			console.log(`Banner: ${config.source} (version ${version}, year ${year})`);

			for (let i: number = 0; i < targetPaths.length; i++) {
				if (fs.readFileSync(targetPaths[i], "utf8").indexOf(banner + "\n") === 0) {
					console.log(`${config.targets[i]}: already has the banner, left unchanged`);
				} else {
					prependBanner(targetPaths[i], banner);
					console.log(`${config.targets[i]}: banner added`);
				}
			}
		}
	}

}

export default BannerTask;
