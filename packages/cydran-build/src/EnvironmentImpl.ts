import { requireNotNull } from "./Utils";
import Environment from "./Environment";

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
