import fs from "fs";
import path from "path";
import { requireNotNull } from "../Utils.js";
import resolveFiles from "../ResolveFiles.js";
import { FormatConfig, isActive, readFormatConfig } from "./FormatConfig.js";
import { FormatError, formatSource } from "./FormatSource.js";

interface FormattedFile {

	/** Package-relative path of the file. */
	path: string;

	/** The formatted form, or null when the file could not be formatted. */
	formatted: string;

	/** Why the file could not be formatted, or null when it could. */
	error: string;

	/** Whether the file differs from its formatted form. False when the file could not be formatted. */
	changed: boolean;

}

interface FormatScan {

	config: FormatConfig;

	files: FormattedFile[];

}

async function formatFile(packageRoot: string, filePath: string, config: FormatConfig): Promise<FormattedFile> {
	const text: string = fs.readFileSync(path.join(packageRoot, filePath), "utf8");
	let file: FormattedFile = null;

	try {
		const formatted: string = await formatSource(text, config);

		file = { path: filePath, formatted: formatted, error: null, changed: formatted !== text };
	} catch (error) {
		if (!(error instanceof FormatError)) {
			throw error;
		}

		file = { path: filePath, formatted: null, error: error.message, changed: false };
	}

	return file;
}

/**
 * Formats every matched file in memory, the shared first step of the check and the format task.
 */
async function scanFormat(packageRoot: string, config: FormatConfig): Promise<FormatScan> {
	requireNotNull(packageRoot, "packageRoot");
	requireNotNull(config, "config");

	const files: FormattedFile[] = [];

	for (const filePath of resolveFiles(packageRoot, config.include, config.exclude)) {
		files.push(await formatFile(packageRoot, filePath, config));
	}

	return { config: config, files: files };
}

/**
 * Scans the package when its format section is active, and returns null when it is not. Throws when the section is
 * invalid.
 */
async function scanIfActive(packageRoot: string, raw: any): Promise<FormatScan> {
	requireNotNull(packageRoot, "packageRoot");

	let scan: FormatScan = null;

	if (isActive(raw)) {
		scan = await scanFormat(packageRoot, readFormatConfig(raw));
	}

	return scan;
}

export { FormattedFile, FormatScan, scanIfActive };
