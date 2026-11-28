import fg from "fast-glob";
import path from "path";
import { requireNotNull } from "../Utils.js";

const SECTION_NAME: string = "clean";

function toPattern(packageRoot: string, directory: string): string {
	return fg.escapePath(path.relative(packageRoot, directory).split(path.sep).join("/"));
}

/**
 * Resolves and validates clean.paths. A null value means the output directory, the work directory, coverage and the
 * packed tarballs. Each entry is a path or glob relative to the package root, and must stay inside it.
 */
function readCleanPaths(raw: any, packageRoot: string, distPath: string, workPath: string): string[] {
	requireNotNull(packageRoot, "packageRoot");
	requireNotNull(distPath, "distPath");
	requireNotNull(workPath, "workPath");

	const configured: unknown = (raw === null || raw === undefined) ? null : raw["paths"];
	const paths: unknown = (configured === null || configured === undefined)
		? [toPattern(packageRoot, distPath), toPattern(packageRoot, workPath), "coverage", "*.tgz"]
		: configured;

	if (!Array.isArray(paths) || !paths.every((entry: unknown) => typeof entry === "string" && entry.length > 0)) {
		throw new Error(`${SECTION_NAME}.paths must be an array of non-empty strings`);
	}

	for (const entry of paths as string[]) {
		const relative: string = path.relative(packageRoot, path.resolve(packageRoot, entry));

		if (path.isAbsolute(entry)) {
			throw new Error(`${SECTION_NAME}.paths entry "${entry}" must be relative to the package root`);
		} else if (relative === "") {
			throw new Error(`${SECTION_NAME}.paths entry "${entry}" must not be the package root`);
		} else if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) {
			throw new Error(`${SECTION_NAME}.paths entry "${entry}" must not lead outside the package root`);
		}
	}

	return paths as string[];
}

export { SECTION_NAME, readCleanPaths };
