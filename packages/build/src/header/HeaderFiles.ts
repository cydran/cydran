import fg from "fast-glob";
import { requireNotNull } from "../Utils.js";

/**
 * Resolves the package-relative paths matched by the include globs and not matched by the exclude globs, sorted for
 * stable output.
 */
function resolveHeaderFiles(packageRoot: string, include: string[], exclude: string[]): string[] {
	requireNotNull(packageRoot, "packageRoot");
	requireNotNull(include, "include");
	requireNotNull(exclude, "exclude");

	return fg.sync(include, { cwd: packageRoot, ignore: exclude, onlyFiles: true }).sort();
}

export default resolveHeaderFiles;
