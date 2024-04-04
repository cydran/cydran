import { requireNotNull } from "./Utils";
import Environment from "./Environment";
import Common from "./config/Common";

const sections = ["start","build", "clean", "test", "eject", "help", "common"];

class Config {

	private environment: Environment;

	private common: Common;

	private raw: any;

	constructor(environment: Environment, common: Common, raw: any) {
		this.environment = requireNotNull(environment, "environment");
		this.common = requireNotNull(common, "common");
		this.raw = requireNotNull(raw, "raw");
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

	/* {
			task: config[name],
			common: config.common,
			env: {
				rootPath: this.rootPath
			}
		} 
	 */

}

export default Config;
