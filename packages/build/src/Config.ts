import { requireNotNull } from "./Utils.js";
import Environment from "./Environment.js";
import Common from "./config/Common.js";

const sections = ["start","build", "clean", "test", "eject", "help", "common"];

class Config {

	private environment: Environment;

	private common: Common;

	private raw: any;

	private packageJson: any;

	constructor(environment: Environment, common: Common, raw: any, packageJson: any) {
		this.environment = requireNotNull(environment, "environment");
		this.common = requireNotNull(common, "common");
		this.raw = requireNotNull(raw, "raw");
		this.packageJson = requireNotNull(packageJson, "packageJson");
	}

	public getEnvironment(): Environment {
		return this.environment;
	}

	public getCommon(): Common {
		return this.common;
	}

	public getTask<T>(name: string): T {
		return this.raw[name] as T;
	}

	public getPackageJson(): any {
		return this.packageJson;
	}

}

export default Config;
