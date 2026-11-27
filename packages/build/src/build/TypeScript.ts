import fs from "fs";
import path from "path";
import ts from "typescript";
import { requireNotNull } from "../Utils.js";

/**
 * Formats the error diagnostics as "file (line,col): message", with the file relative to the package root.
 */
function formatErrors(packageRoot: string, diagnostics: readonly ts.Diagnostic[]): string[] {
	requireNotNull(packageRoot, "packageRoot");
	requireNotNull(diagnostics, "diagnostics");

	return diagnostics.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error).map((diagnostic) => {
		const message: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
		let text: string = message;

		if (diagnostic.file !== undefined && diagnostic.start !== undefined) {
			const position: ts.LineAndCharacter = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
			text = `${path.relative(packageRoot, diagnostic.file.fileName)} (${position.line + 1},${position.character + 1}): ${message}`;
		}

		return text;
	});
}

/**
 * Reads the package's tsconfig.json: its raw compilerOptions and the parsed command line. Fails, with the errors,
 * when the file is missing or invalid.
 */
function readTsConfig(tsConfigPath: string, packageRoot: string): { rawOptions: any, parsed: ts.ParsedCommandLine } {
	requireNotNull(tsConfigPath, "tsConfigPath");
	requireNotNull(packageRoot, "packageRoot");

	if (!fs.existsSync(tsConfigPath)) {
		throw new Error(`TypeScript configuration not found: ${tsConfigPath}`);
	}

	const read: { config?: any, error?: ts.Diagnostic } = ts.readConfigFile(tsConfigPath, ts.sys.readFile);

	if (read.error !== undefined) {
		throw new Error(`Invalid TypeScript configuration ${tsConfigPath}:\n${formatErrors(packageRoot, [read.error]).join("\n")}`);
	}

	const parsed: ts.ParsedCommandLine = ts.parseJsonConfigFileContent(read.config, ts.sys, path.dirname(tsConfigPath), undefined, tsConfigPath);
	const errors: string[] = formatErrors(packageRoot, parsed.errors);

	if (errors.length > 0) {
		throw new Error(`Invalid TypeScript configuration ${tsConfigPath}:\n${errors.join("\n")}`);
	}

	const rawOptions: any = (read.config["compilerOptions"] === undefined) ? {} : read.config["compilerOptions"];

	return { rawOptions: rawOptions, parsed: parsed };
}

export { formatErrors, readTsConfig };
