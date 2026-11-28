import path from "path";
import Config from "../Config.js";
import { BuildConfig } from "./BuildConfig.js";
import { requireNotNull } from "../Utils.js";

const ENTRY_NAME: string = "index";

/**
 * The paths the build steps share, resolved from the common directories.
 */
class BuildPaths {

	private packageRoot: string;

	private srcPath: string;

	private distPath: string;

	private workPath: string;

	constructor(config: Config) {
		requireNotNull(config, "config");

		this.packageRoot = config.getEnvironment().getRootPath();
		this.srcPath = config.getCommon().getSrcPath();
		this.distPath = config.getCommon().getDistPath();
		this.workPath = config.getCommon().getWorkPath();
	}

	public getPackageRoot(): string {
		return this.packageRoot;
	}

	public getSrcPath(): string {
		return this.srcPath;
	}

	public getDistPath(): string {
		return this.distPath;
	}

	/**
	 * The bundle <dist>/<name>[.min]<extension>.
	 */
	public getBundleFile(name: string, minify: boolean, extension: string): string {
		return path.resolve(this.distPath, `${name}${minify ? ".min" : ""}${extension}`);
	}

	public getDeclarationBundle(name: string): string {
		return path.resolve(this.distPath, name + ".d.ts");
	}

	/**
	 * Every file the build writes to the output directory, without the sourcemaps: the ES module and UMD bundles, their
	 * minified variants, and the declaration bundle. The banner targets are derived from it.
	 */
	public getPublishedFiles(config: BuildConfig): string[] {
		return [
			this.getBundleFile(config.name, false, ".mjs"),
			this.getBundleFile(config.name, false, ".js"),
			this.getBundleFile(config.name, true, ".mjs"),
			this.getBundleFile(config.name, true, ".js"),
			this.getDeclarationBundle(config.name)
		];
	}

	public getEntrySource(): string {
		return path.resolve(this.srcPath, ENTRY_NAME + ".ts");
	}

	public getCompiledPath(): string {
		return path.resolve(this.workPath, "js");
	}

	public getCompiledEntry(): string {
		return path.resolve(this.getCompiledPath(), ENTRY_NAME + ".js");
	}

	public getCompiledDeclarationEntry(): string {
		return path.resolve(this.getCompiledPath(), ENTRY_NAME + ".d.ts");
	}

	public getDeclarationsTsConfig(): string {
		return path.resolve(this.workPath, "tsconfig.declarations.json");
	}

	public getBundlerTsConfig(): string {
		return path.resolve(this.workPath, "tsconfig.esbuild.json");
	}

	public getPackageTsConfig(): string {
		return path.resolve(this.packageRoot, "tsconfig.json");
	}

	public relative(filePath: string): string {
		return path.relative(this.packageRoot, filePath);
	}

}

export default BuildPaths;
