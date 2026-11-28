const SECTION_NAME: string = "source-headers";

interface SourceHeadersConfig {

	active: boolean;

	include: string[];

	exclude: string[];

	headerFile: string;

}

function isStringArray(value: unknown): boolean {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isActive(raw: any): boolean {
	const active: unknown = (raw === null || raw === undefined) ? false : raw["active"];

	if (typeof active !== "boolean") {
		throw new Error(`${SECTION_NAME}.active must be a boolean`);
	}

	return active;
}

function readSourceHeadersConfig(raw: any): SourceHeadersConfig {
	const active: boolean = isActive(raw);

	if (!isStringArray(raw["include"])) {
		throw new Error(`${SECTION_NAME}.include must be an array of strings`);
	}

	if (!isStringArray(raw["exclude"])) {
		throw new Error(`${SECTION_NAME}.exclude must be an array of strings`);
	}

	if (typeof raw["headerFile"] !== "string" || raw["headerFile"].length === 0) {
		throw new Error(`${SECTION_NAME}.headerFile must be a non-empty string`);
	}

	return {
		active: active,
		include: raw["include"],
		exclude: raw["exclude"],
		headerFile: raw["headerFile"]
	};
}

const INACTIVE_NOTICE: string = `Source headers inactive (${SECTION_NAME}.active is false); skipping`;

export { SourceHeadersConfig, SECTION_NAME, INACTIVE_NOTICE, isActive, readSourceHeadersConfig };
