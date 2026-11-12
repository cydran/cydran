import fg from "fast-glob";
import { requireNotNull } from "./Utils.js";

/**
 * Resolves the paths, relative to the base directory, of the files matched by the include globs and not matched by
 * the exclude globs, sorted for stable output.
 */
function resolveFiles(baseDirectory: string, include: string[], exclude: string[]): string[] {
	requireNotNull(baseDirectory, "baseDirectory");
	requireNotNull(include, "include");
	requireNotNull(exclude, "exclude");

	return fg.sync(include, { cwd: baseDirectory, ignore: exclude, onlyFiles: true }).sort();
}

export default resolveFiles;
