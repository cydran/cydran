import { requireNotNull } from './Utils.js';
import * as ts from "typescript";
import path from "path";
import Environment from './Environment.js';

class TranspilerFacade {

	private sourcePath: string;

	private destPath: string;

	private environment: Environment;

	constructor(sourcePath: string, destPath: string, environment: Environment) {
		this.sourcePath = requireNotNull(sourcePath, "sourcePath");
		this.destPath = requireNotNull(destPath, "destPath");
		this.environment = requireNotNull(environment, "environment");
	}

	public compile(): void {
		const resourcePath: string = path.resolve(this.environment.getAppRootPath(), "resources");
		const nodeModulesPath: string = path.resolve(this.environment.getRootPath(), "node_modules");
		const typescriptPath: string = path.resolve(resourcePath, "typescript");
		const typesPath: string = path.resolve(typescriptPath, "types");
		const localTypesPath: string = path.resolve(nodeModulesPath, "@types");


		console.log("Compiling from: " + this.sourcePath);
		console.log("Compiling to: " + this.destPath);
		console.log("Types Path: " + typesPath);

		const indexFile: string = path.resolve(this.sourcePath, "index.ts");
		const typeRoots: string[] = [localTypesPath, typesPath];

		const options: ts.CompilerOptions = {
			target: ts.ScriptTarget.ES5,
			module: ts.ModuleKind.CommonJS,
			declaration: true,
			resolveJsonModule: true,
			esModuleInterop: true,
			baseUrl: this.environment.getRootPath(),
			outDir: this.destPath,
			typeRoots: typeRoots,
			paths: {
				"*": [typesPath + "/*"]
			}
		};

		console.log(options);

		this.transpile([indexFile], options);
	}

	private transpile(fileNames: string[], options: ts.CompilerOptions): void {
		const program = ts.createProgram(fileNames, options);
		const emitResult = program.emit();
		const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

		allDiagnostics.forEach(diagnostic => {
			if (diagnostic.file) {
				const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
				const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
				console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
			} else {
				console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
			}
		});

		const exitCode = emitResult.emitSkipped ? 1 : 0;
		console.log(`Process exiting with code '${exitCode}'.`);
		process.exit(exitCode);
	  }
}

export default TranspilerFacade;
