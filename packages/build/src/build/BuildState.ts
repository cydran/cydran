import { BuildConfig } from "./BuildConfig.js";

/**
 * Shared by the build task and its steps. The build task sets the validated configuration before any step runs.
 */
class BuildState {

	private config: BuildConfig;

	constructor() {
		this.config = null;
	}

	public getConfig(): BuildConfig {
		if (this.config === null) {
			throw new Error("The build configuration has not been read");
		}

		return this.config;
	}

	public setConfig(config: BuildConfig): void {
		this.config = config;
	}

}

export default BuildState;
