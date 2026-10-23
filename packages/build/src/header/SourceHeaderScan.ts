import fs from "fs";
import path from "path";
import { requireNotNull } from "../Utils.js";
import { SourceHeader, Analysis } from "./SourceHeader.js";
import { SourceHeadersConfig, isActive, readSourceHeadersConfig } from "./SourceHeadersConfig.js";
import resolveHeaderFiles from "./HeaderFiles.js";

interface ScannedFile {

	path: string;

	analysis: Analysis;

}

interface SourceHeaderScan {

	config: SourceHeadersConfig;

	header: SourceHeader;

	files: ScannedFile[];

}

/**
 * Loads the configured header and classifies every matched file, the shared first step of the check and the fix.
 */
function scanSourceHeaders(packageRoot: string, config: SourceHeadersConfig): SourceHeaderScan {
	requireNotNull(packageRoot, "packageRoot");
	requireNotNull(config, "config");

	const header: SourceHeader = SourceHeader.load(packageRoot, config.headerFile, new Date().getFullYear());
	const files: ScannedFile[] = resolveHeaderFiles(packageRoot, config.include, config.exclude).map((filePath) => ({
		path: filePath,
		analysis: header.analyze(fs.readFileSync(path.join(packageRoot, filePath), "utf8"))
	}));

	return { config: config, header: header, files: files };
}

/**
 * Scans the package when its source-headers section is active, and returns null when it is not. Throws when the
 * section is invalid or the header file is missing or empty.
 */
function scanIfActive(packageRoot: string, raw: any): SourceHeaderScan {
	requireNotNull(packageRoot, "packageRoot");

	let scan: SourceHeaderScan = null;

	if (isActive(raw)) {
		scan = scanSourceHeaders(packageRoot, readSourceHeadersConfig(raw));
	}

	return scan;
}

function describe(file: ScannedFile): string {
	let description: string;

	switch (file.analysis.classification) {
		case "missing":
			description = `${file.path}: missing header`;
			break;
		case "outdated":
			description = `${file.path}: outdated header (${file.analysis.foundYear})`;
			break;
		case "unrecognized":
			description = `${file.path}: unrecognized header`;
			break;
		default:
			description = `${file.path}: conforming`;
	}

	return description;
}

export { ScannedFile, SourceHeaderScan, scanSourceHeaders, scanIfActive, describe };
