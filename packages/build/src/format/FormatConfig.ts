const SECTION_NAME: string = "format";

const INDENT_STYLES: string[] = ["tab", "space"];

const QUOTE_STYLES: string[] = ["double", "single"];

const TRAILING_COMMAS: string[] = ["none", "es5", "all"];

type IndentStyle = "tab" | "space";

type QuoteStyle = "double" | "single";

type TrailingCommas = "none" | "es5" | "all";

interface FormatConfig {

	active: boolean;

	include: string[];

	exclude: string[];

	lineWidth: number;

	indentStyle: IndentStyle;

	indentWidth: number;

	quoteStyle: QuoteStyle;

	semicolons: boolean;

	trailingCommas: TrailingCommas;

	bodyPaddingLines: number;

	memberSpacingLines: number;

	enumMemberSpacingLines: number;

}

function isStringArray(value: unknown): boolean {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isPositiveInteger(value: unknown): boolean {
	return Number.isInteger(value) && (value as number) > 0;
}

function isNonNegativeInteger(value: unknown): boolean {
	return Number.isInteger(value) && (value as number) >= 0;
}

function isOneOf(value: unknown, allowed: string[]): boolean {
	return typeof value === "string" && allowed.includes(value);
}

function isActive(raw: any): boolean {
	const active: unknown = (raw === null || raw === undefined) ? false : raw["active"];

	if (typeof active !== "boolean") {
		throw new Error(`${SECTION_NAME}.active must be a boolean`);
	}

	return active;
}

function readFormatConfig(raw: any): FormatConfig {
	const active: boolean = isActive(raw);

	if (!isStringArray(raw["include"])) {
		throw new Error(`${SECTION_NAME}.include must be an array of strings`);
	}

	if (!isStringArray(raw["exclude"])) {
		throw new Error(`${SECTION_NAME}.exclude must be an array of strings`);
	}

	if (!isPositiveInteger(raw["lineWidth"])) {
		throw new Error(`${SECTION_NAME}.lineWidth must be a positive integer`);
	}

	if (!isOneOf(raw["indentStyle"], INDENT_STYLES)) {
		throw new Error(`${SECTION_NAME}.indentStyle must be one of: ${INDENT_STYLES.join(", ")}`);
	}

	if (!isPositiveInteger(raw["indentWidth"])) {
		throw new Error(`${SECTION_NAME}.indentWidth must be a positive integer`);
	}

	if (!isOneOf(raw["quoteStyle"], QUOTE_STYLES)) {
		throw new Error(`${SECTION_NAME}.quoteStyle must be one of: ${QUOTE_STYLES.join(", ")}`);
	}

	if (typeof raw["semicolons"] !== "boolean") {
		throw new Error(`${SECTION_NAME}.semicolons must be a boolean`);
	}

	if (!isOneOf(raw["trailingCommas"], TRAILING_COMMAS)) {
		throw new Error(`${SECTION_NAME}.trailingCommas must be one of: ${TRAILING_COMMAS.join(", ")}`);
	}

	if (!isNonNegativeInteger(raw["bodyPaddingLines"])) {
		throw new Error(`${SECTION_NAME}.bodyPaddingLines must be a non-negative integer`);
	}

	if (!isNonNegativeInteger(raw["memberSpacingLines"])) {
		throw new Error(`${SECTION_NAME}.memberSpacingLines must be a non-negative integer`);
	}

	if (!isNonNegativeInteger(raw["enumMemberSpacingLines"])) {
		throw new Error(`${SECTION_NAME}.enumMemberSpacingLines must be a non-negative integer`);
	}

	return {
		active: active,
		include: raw["include"],
		exclude: raw["exclude"],
		lineWidth: raw["lineWidth"],
		indentStyle: raw["indentStyle"],
		indentWidth: raw["indentWidth"],
		quoteStyle: raw["quoteStyle"],
		semicolons: raw["semicolons"],
		trailingCommas: raw["trailingCommas"],
		bodyPaddingLines: raw["bodyPaddingLines"],
		memberSpacingLines: raw["memberSpacingLines"],
		enumMemberSpacingLines: raw["enumMemberSpacingLines"]
	};
}

const INACTIVE_NOTICE: string = `Formatting inactive (${SECTION_NAME}.active is false); skipping`;

export { FormatConfig, IndentStyle, QuoteStyle, TrailingCommas, SECTION_NAME, INACTIVE_NOTICE, isActive, readFormatConfig };
