import path from "path";
import Environment from "../Environment";
import EnvironmentImpl from "../EnvironmentImpl";
import Config from "../Config";
import CommonImpl from './CommonImpl';
import DEFAULT_CONFIG from "../default-config.json";
import { loadJson, merge, requireNotNull } from "../Utils";
import Common from "./Common";

class ConfigFactory {

	private appRootPath: string;

	constructor(appRootPath: string) {
		this.appRootPath = requireNotNull(appRootPath, "appRootPath");
	}

	public create(): Config {
		const resolver: (rootPath: string, childPath: string) => string = (rootPath, childPath) => path.resolve(rootPath, childPath);
		const environment: Environment = new EnvironmentImpl(this.appRootPath);

		const packageJsonPath = path.resolve(environment.getRootPath(), "package.json");
		const packageJson = loadJson(packageJsonPath);
		const packageJsonConfig = packageJson["cydran-build"];
		const raw = merge([DEFAULT_CONFIG, packageJsonConfig]);
		const common: Common = new CommonImpl(environment, resolver, raw["common"]);
		const config: Config = new Config(environment, common, raw);

		return config;
	}

	private loadConfig(): any {
	}

}

export default ConfigFactory;
