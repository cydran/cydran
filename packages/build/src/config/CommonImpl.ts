import Common from "./Common";
import Environment from "../Environment";

class CommonImpl implements Common {

	private distPath: string;

	private workPath: string;

	private staticPath: string;

	private srcPath: string;

	private testPath: string;

	constructor(environment: Environment, resolver: (root: string, path: string) => string, raw: any) {
		this.distPath = resolver(environment.getRootPath(), raw["distDirectory"]);
		this.staticPath = resolver(environment.getRootPath(), raw["staticDirectory"]);
		this.workPath = resolver(environment.getRootPath(), raw["workDirectory"]);
		this.srcPath = resolver(environment.getRootPath(), raw["srcDirectory"]);
		this.testPath = resolver(environment.getRootPath(), raw["testDirectory"]);
	}

	public getDistPath(): string {
		return this.distPath;
	}

	public getStaticPath(): string {
		return this.staticPath;
	}

	public getWorkPath(): string {
		return this.workPath;
	}

	public getSrcPath(): string {
		return this.srcPath;
	}

	public getTestPath(): string {
		return this.testPath;
	}

}

export default CommonImpl;
