import fs from "fs";
import { requireNotNull } from "../Utils.js";
import { YEAR_TOKEN } from "../header/SourceHeader.js";

const MAPPINGS: RegExp = /("mappings"\s*:\s*")/;

function countLines(text: string): number {
	return text.split("\n").length - 1;
}

/**
 * The comment block placed at the top of each bundle: the package version and the banner source, with every
 * ${year} replaced by the build year. This is the form esbuild's banner option produced from the same parts.
 */
function createBanner(version: string, source: string, year: number): string {
	requireNotNull(version, "version");
	requireNotNull(source, "source");
	requireNotNull(year, "year");

	return `/*\n${version}\n---\n${source.split(YEAR_TOKEN).join(String(year))}\n*/`;
}

/**
 * Prepends the banner and a line break to the target. An adjacent sourcemap gets one ";" per inserted line at
 * the start of its mappings, so every existing mapping still points at the same generated code.
 */
function prependBanner(targetPath: string, banner: string): void {
	requireNotNull(targetPath, "targetPath");
	requireNotNull(banner, "banner");

	const prefix: string = banner + "\n";
	fs.writeFileSync(targetPath, prefix + fs.readFileSync(targetPath, "utf8"), "utf8");

	const mapPath: string = targetPath + ".map";

	if (fs.existsSync(mapPath)) {
		writeReplacement(mapPath, prefix);
	}
}

function writeReplacement(mapPath: string, prefix: string): void {
	const map: string = fs.readFileSync(mapPath, "utf8");

	if (!MAPPINGS.test(map)) {
		throw new Error(`Sourcemap has no mappings: ${mapPath}`);
	}

	const replaced: string = map.replace(MAPPINGS, "$1" + ";".repeat(countLines(prefix)));

	fs.writeFileSync(mapPath, replaced, "utf8");
}

export { createBanner, prependBanner };
