const SECTION_NAME: string = "build";

const PLATFORMS: string[] = ["browser", "node"];

interface BuildConfig {

	active: boolean;

	name: string;

	minify: boolean;

	target: string;

	platform: string;

	external: string[];

}

function isActive(raw: any): boolean {
	const active: unknown = (raw === null || raw === undefined) ? false : raw["active"];

	if (typeof active !== "boolean") {
		throw new Error(`${SECTION_NAME}.active must be a boolean`);
	}

	return active;
}

/**
 * Validates an active build section. A null external means the names of the package's dependencies.
 */
function readBuildConfig(raw: any, packageJson: any): BuildConfig {
	const active: boolean = isActive(raw);

	if (typeof raw["name"] !== "string" || raw["name"].length === 0) {
		throw new Error(`${SECTION_NAME}.name must be a non-empty string`);
	}

	if (typeof raw["minify"] !== "boolean") {
		throw new Error(`${SECTION_NAME}.minify must be a boolean`);
	}

	if (typeof raw["target"] !== "string" || raw["target"].length === 0) {
		throw new Error(`${SECTION_NAME}.target must be a non-empty string`);
	}

	if (PLATFORMS.indexOf(raw["platform"]) === -1) {
		throw new Error(`${SECTION_NAME}.platform must be one of ${PLATFORMS.map((platform) => `"${platform}"`).join(", ")}`);
	}

	const external: unknown = raw["external"];

	if (external !== null && external !== undefined && !(Array.isArray(external) && external.every((entry: unknown) => typeof entry === "string"))) {
		throw new Error(`${SECTION_NAME}.external must be null or an array of strings`);
	}

	const dependencies: any = (packageJson === null || packageJson === undefined) ? null : packageJson["dependencies"];
	const defaultExternal: string[] = (dependencies === null || dependencies === undefined) ? [] : Object.keys(dependencies);

	return {
		active: active,
		name: raw["name"],
		minify: raw["minify"],
		target: raw["target"],
		platform: raw["platform"],
		external: (external === null || external === undefined) ? defaultExternal : external as string[]
	};
}

const INACTIVE_NOTICE: string = `Build inactive (${SECTION_NAME}.active is false); skipping`;

export { BuildConfig, SECTION_NAME, INACTIVE_NOTICE, isActive, readBuildConfig };
