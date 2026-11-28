import fs from "fs";
import ts from "typescript";
import AbstractTask from "../AbstractTask.js";
import BuildPaths from "../../build/BuildPaths.js";
import { formatErrors, readTsConfig } from "../../build/TypeScript.js";

/**
 * Compiles the package's sources with its tsconfig.json into the work directory. The source root, the output
 * location, declarations and sourcemaps are set by the build; every other option is the package's.
 */
class CompileTask extends AbstractTask<any> {

	constructor() {
		super("Compile");
	}

	public async execute(): Promise<void> {
		const paths: BuildPaths = new BuildPaths(this.getConfig());
		const packageRoot: string = paths.getPackageRoot();
		const tsConfig = readTsConfig(paths.getPackageTsConfig(), packageRoot);
		const options: ts.CompilerOptions = {
			...tsConfig.parsed.options,
			rootDir: paths.getSrcPath(),
			outDir: paths.getCompiledPath(),
			declarationDir: paths.getCompiledPath(),
			declaration: true,
			sourceMap: true,
			// Both bundles are built from one compile: esbuild can only expose CommonJS input as a single default export,
			// so the ES module bundle needs ES module input. The package's tsconfig.json keeps its own module setting,
			// which the tests compile with.
			module: ts.ModuleKind.ES2020
		};

		fs.rmSync(paths.getCompiledPath(), { recursive: true, force: true });
		this.print(`Compiling ${paths.relative(paths.getSrcPath())} into ${paths.relative(paths.getCompiledPath())}`);

		// The diagnostics are collected before emitting, as tsc does: collected after a declaration emit, the checker
		// reports errors that tsc doesn't.
		const program: ts.Program = ts.createProgram(tsConfig.parsed.fileNames, options);
		const preEmitErrors: string[] = formatErrors(packageRoot, ts.getPreEmitDiagnostics(program));
		const emitResult: ts.EmitResult = (preEmitErrors.length === 0) ? program.emit() : null;
		const errors: string[] = (emitResult === null) ? preEmitErrors : formatErrors(packageRoot, emitResult.diagnostics);

		for (const error of errors) {
			console.error(error);
		}

		if (errors.length > 0) {
			throw new Error(`Compile failed: ${errors.length} TypeScript error${errors.length === 1 ? "" : "s"}`);
		} else if (emitResult.emitSkipped) {
			throw new Error("Compile failed: nothing was emitted");
		}

		this.print(`Compiled ${tsConfig.parsed.fileNames.length} source files`);
	}

}

export default CompileTask;
