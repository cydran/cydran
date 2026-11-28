import fs from "fs";
import path from "path";
import ts from "typescript";
import { generateDtsBundle } from "dts-bundle-generator";
import AbstractTask from "../AbstractTask.js";
import BuildPaths from "../../build/BuildPaths.js";
import BuildState from "../../build/BuildState.js";
import { formatErrors, readTsConfig } from "../../build/TypeScript.js";
import { requireNotNull } from "../../Utils.js";

/**
 * Bundles the compiled declarations into <dist>/<name>.d.ts and type-checks the result, as the dts-bundle-generator
 * command line did. Module-style imports resolve through a tsconfig written to the work directory.
 */
class BundleDeclarationsTask extends AbstractTask<any> {

	private state: BuildState;

	constructor(state: BuildState) {
		super("Bundle Declarations");
		this.state = requireNotNull(state, "state");
	}

	public async execute(): Promise<void> {
		const name: string = this.state.getConfig().name;
		const paths: BuildPaths = new BuildPaths(this.getConfig());
		const packageRoot: string = paths.getPackageRoot();
		const entry: string = paths.getCompiledDeclarationEntry();
		const outFile: string = paths.getDeclarationBundle(name);

		if (!fs.existsSync(entry)) {
			throw new Error(`Bundle Declarations failed: compiled declaration entry not found: ${paths.relative(entry)}`);
		}

		const tsConfigPath: string = this.writeTsConfig(paths);
		const generated: string[] = generateDtsBundle([{
			filePath: entry,
			output: {
				inlineDeclareGlobals: false,
				sortNodes: true,
				umdModuleName: name,
				noBanner: true
			}
		}], { preferredConfigPath: tsConfigPath });

		fs.mkdirSync(paths.getDistPath(), { recursive: true });
		ts.sys.writeFile(outFile, generated[0]);
		this.print(`Wrote ${paths.relative(outFile)}`);

		const checkOptions: ts.CompilerOptions = { ...readTsConfig(tsConfigPath, packageRoot).parsed.options, declaration: true, skipLibCheck: false };
		const errors: string[] = formatErrors(packageRoot, ts.getPreEmitDiagnostics(ts.createProgram([outFile], checkOptions)));

		for (const error of errors) {
			console.error(error);
		}

		if (errors.length > 0) {
			throw new Error(`Bundle Declarations failed: ${paths.relative(outFile)} has ${errors.length} error${errors.length === 1 ? "" : "s"}`);
		}
	}

	/**
	 * The package's compiler options with module-style imports resolved from the compiled declarations, and every
	 * path made absolute, since the file lives in the work directory.
	 */
	private writeTsConfig(paths: BuildPaths): string {
		const packageRoot: string = paths.getPackageRoot();
		const rawOptions: any = readTsConfig(paths.getPackageTsConfig(), packageRoot).rawOptions;
		const typeRoots: string[] = Array.isArray(rawOptions["typeRoots"])
			? rawOptions["typeRoots"].map((typeRoot: string) => path.resolve(packageRoot, typeRoot))
			: [path.resolve(packageRoot, "node_modules", "@types")];
		const compilerOptions: any = { ...rawOptions };

		delete compilerOptions["rootDirs"];
		delete compilerOptions["rootDir"];
		compilerOptions["baseUrl"] = paths.getCompiledPath();
		compilerOptions["outDir"] = paths.getCompiledPath();
		compilerOptions["declarationDir"] = paths.getCompiledPath();
		compilerOptions["typeRoots"] = typeRoots;

		const tsConfigPath: string = paths.getDeclarationsTsConfig();
		fs.writeFileSync(tsConfigPath, JSON.stringify({ compilerOptions: compilerOptions, files: [paths.getCompiledDeclarationEntry()] }, null, "\t") + "\n", "utf8");

		return tsConfigPath;
	}

}

export default BundleDeclarationsTask;
