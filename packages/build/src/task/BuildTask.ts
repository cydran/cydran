import fs from "fs";
import AbstractCompoundTask from "./AbstractCompoundTask.js";
import BannerTask from "./BannerTask.js";
import CleanTask from "./CleanTask.js";
import CompileTask from "./build/CompileTask.js";
import BundleDeclarationsTask from "./build/BundleDeclarationsTask.js";
import BundleJavaScriptTask from "./build/BundleJavaScriptTask.js";
import RemoveWorkOutputTask from "./build/RemoveWorkOutputTask.js";
import BuildPaths from "../build/BuildPaths.js";
import BuildState from "../build/BuildState.js";
import { SECTION_NAME, INACTIVE_NOTICE, isActive, readBuildConfig, BuildConfig } from "../build/BuildConfig.js";
import { SECTION_NAME as CLEAN_SECTION_NAME, readCleanPaths } from "../clean/CleanConfig.js";

/**
 * Builds a library package's published files: clean, compile, bundle the declarations and the JavaScript, add the
 * banner, and remove the intermediate output. The configuration is checked before any step runs.
 */
class BuildTask extends AbstractCompoundTask {

	private state: BuildState;

	constructor() {
		super("Build");
		this.state = new BuildState();
		this.add(new CleanTask());
		this.add(new CompileTask());
		this.add(new BundleDeclarationsTask(this.state));
		this.add(new BundleJavaScriptTask(this.state));
		this.add(new BannerTask());
		this.add(new RemoveWorkOutputTask());
	}

	public async execute(): Promise<void> {
		const raw: any = this.getTaskConfig(SECTION_NAME);

		if (isActive(raw)) {
			const config: BuildConfig = readBuildConfig(raw, this.getConfig().getPackageJson());
			const paths: BuildPaths = new BuildPaths(this.getConfig());
			const common = this.getConfig().getCommon();

			readCleanPaths(this.getTaskConfig(CLEAN_SECTION_NAME), paths.getPackageRoot(), common.getDistPath(), common.getWorkPath());

			if (!fs.existsSync(paths.getEntrySource())) {
				throw new Error(`Build entry not found: ${paths.relative(paths.getEntrySource())}`);
			}

			this.state.setConfig(config);
			await super.execute();
		} else {
			this.print(INACTIVE_NOTICE);
		}
	}

}

export default BuildTask;
