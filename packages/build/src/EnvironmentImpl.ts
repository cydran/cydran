import { requireNotNull } from "./Utils.js";
import Environment from "./Environment.js";

class EnvironmentImpl implements Environment {

	private rootPath: string;

	private appRootPath: string;

	constructor(appRootPath: string) {
		this.appRootPath = requireNotNull(appRootPath, "appRootPath");
		this.rootPath = process.cwd();
	}

	public getRootPath(): string {
		return this.rootPath;
	}

	public getAppRootPath(): string {
		return this.appRootPath;
	}

}

export default EnvironmentImpl;
