import { format, Options } from "prettier";
import { requireNotNull } from "../Utils.js";
import { FormatConfig } from "./FormatConfig.js";
import { UnsupportedLayoutError, createLayoutPlugin } from "./LayoutPlugin.js";

const UNSUPPORTED_LAYOUT: string = "unsupported class, interface or enum layout";

const LIBRARY_NAME: RegExp = /prettier/i;

/**
 * A file that could not be formatted. The message is the reason only, worded without naming the library that does
 * the formatting.
 */
class FormatError extends Error {

	constructor(reason: string) {
		super(reason);
		this.name = "FormatError";
	}

}

function toOptions(config: FormatConfig): Options {
	return {
		parser: "typescript",
		plugins: [createLayoutPlugin({
			bodyPaddingLines: config.bodyPaddingLines,
			memberSpacingLines: config.memberSpacingLines,
			enumMemberSpacingLines: config.enumMemberSpacingLines
		})],
		printWidth: config.lineWidth,
		useTabs: config.indentStyle === "tab",
		tabWidth: config.indentWidth,
		singleQuote: config.quoteStyle === "single",
		semi: config.semicolons,
		trailingComma: config.trailingCommas,
		arrowParens: "always",
		endOfLine: "lf"
	};
}

/**
 * Describes why formatting failed: a syntax error with its position, an unsupported body layout, or the first line of
 * any other error, unless that line names the library.
 */
function describeFailure(error: any): string {
	const loc: any = error?.loc?.start;
	const firstLine: string = String(error?.message ?? error).split("\n")[0];
	let reason: string = null;

	if (error instanceof UnsupportedLayoutError) {
		reason = UNSUPPORTED_LAYOUT;
	} else if (error?.name === "SyntaxError" && loc !== undefined && error.cause?.message !== undefined) {
		reason = `${error.cause.message} (line ${loc.line}, column ${loc.column})`;
	} else if (LIBRARY_NAME.test(firstLine)) {
		reason = "formatting failed";
	} else {
		reason = firstLine;
	}

	return reason;
}

/**
 * Returns the formatted form of a TypeScript source text. Throws FormatError when the text cannot be parsed or
 * formatted.
 */
async function formatSource(text: string, config: FormatConfig): Promise<string> {
	requireNotNull(text, "text");
	requireNotNull(config, "config");

	let formatted: string = null;

	try {
		formatted = await format(text, toOptions(config));
	} catch (error) {
		throw new FormatError(describeFailure(error));
	}

	return formatted;
}

export { FormatError, formatSource };
