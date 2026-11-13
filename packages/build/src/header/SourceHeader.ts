import fs from "fs";
import path from "path";
import { requireNotNull } from "../Utils.js";

const YEAR_TOKEN: string = "${year}";

const BOM: string = "﻿";

const JEST_DOCBLOCK: RegExp = /^\/\*\*[\s\S]*?\*\//;

const JEST_PRAGMA: string = "@jest-environment";

type Classification = "conforming" | "outdated" | "unrecognized" | "missing";

interface Analysis {

	classification: Classification;

	foundYear?: string;

}

function normalize(text: string): string {
	return text.split("\r\n").join("\n");
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function lineBreakAt(text: string, index: number): number {
	let length: number = 0;

	if (text.substring(index, index + 2) === "\r\n") {
		length = 2;
	} else if (text.charAt(index) === "\n") {
		length = 1;
	}

	return length;
}

function endOfLine(text: string, start: number): number {
	const newline: number = text.indexOf("\n", start);

	return newline === -1 ? text.length : newline + 1;
}

function detectEol(text: string): string {
	const newline: number = text.indexOf("\n");

	return (newline > 0 && text.charAt(newline - 1) === "\r") ? "\r\n" : "\n";
}

/**
 * Returns the length of the preamble that must stay ahead of the header: an optional byte-order mark, then an
 * optional shebang line, then an optional leading docblock containing a Jest environment pragma.
 */
function preambleLength(content: string): number {
	let index: number = content.indexOf(BOM) === 0 ? BOM.length : 0;

	if (content.substring(index, index + 2) === "#!") {
		index = endOfLine(content, index);
	}

	const docblock: RegExpMatchArray = content.substring(index).match(JEST_DOCBLOCK);

	if (docblock !== null && docblock[0].indexOf(JEST_PRAGMA) !== -1) {
		index += docblock[0].length;
		index += lineBreakAt(content, index);
	}

	return index;
}

/**
 * Returns the preamble followed by a line break, so an inserted header starts on its own line. An empty
 * preamble, or one that is only a byte-order mark, is returned unchanged.
 */
function terminatePreamble(preamble: string, eol: string): string {
	const bomOnly: boolean = preamble === "" || preamble === BOM;
	let terminated: string = preamble;

	if (!bomOnly && !/\n$/.test(preamble)) {
		terminated += eol;
	}

	return terminated;
}

class SourceHeader {

	private year: string;

	private text: string;

	private expected: string;

	private pattern: RegExp;

	private firstLine: string;

	constructor(template: string, year: number) {
		requireNotNull(template, "template");
		requireNotNull(year, "year");

		const normalized: string = normalize(template);
		this.text = normalized.charAt(normalized.length - 1) === "\n" ? normalized.slice(0, -1) : normalized;

		if (this.text.trim().length === 0) {
			throw new Error("Source header template is empty");
		}

		this.year = String(year);
		this.expected = this.text.split(YEAR_TOKEN).join(this.year);
		this.pattern = new RegExp("^" + this.text.split(YEAR_TOKEN).map(escapeRegExp).join("(\\d{4})") + "\n");
		this.firstLine = this.expected.split("\n")[0];
	}

	public static load(packageRoot: string, headerFile: string, year: number): SourceHeader {
		requireNotNull(packageRoot, "packageRoot");
		requireNotNull(headerFile, "headerFile");

		const headerPath: string = path.resolve(packageRoot, headerFile);

		if (!fs.existsSync(headerPath)) {
			throw new Error(`Source header file not found: ${headerPath}`);
		}

		const template: string = fs.readFileSync(headerPath, "utf8");

		if (normalize(template).trim().length === 0) {
			throw new Error(`Source header file is empty: ${headerPath}`);
		}

		return new SourceHeader(template, year);
	}

	public getYear(): string {
		return this.year;
	}

	public analyze(content: string): Analysis {
		const body: string = normalize(content.substring(preambleLength(content)));
		const match: RegExpMatchArray = body.match(this.pattern);
		let analysis: Analysis;

		if (body.indexOf(this.expected + "\n") === 0) {
			analysis = { classification: "conforming" };
		} else if (match !== null) {
			const years: string[] = match.slice(1);
			const foundYear: string = years.filter((year) => year !== this.year)[0];

			analysis = { classification: "outdated", foundYear: foundYear };
		} else {
			analysis = { classification: body.split("\n")[0] === this.firstLine ? "unrecognized" : "missing" };
		}

		return analysis;
	}

	/**
	 * Returns the content with the current header in place: inserted after the preamble for a missing header, or
	 * replacing the matched header block for an outdated one. Every other character is preserved.
	 */
	public apply(content: string): string {
		const classification: Classification = this.analyze(content).classification;
		let result: string = content;

		if (classification === "missing" || classification === "outdated") {
			const eol: string = detectEol(content);
			const preambleEnd: number = preambleLength(content);
			const header: string = this.expected.split("\n").join(eol) + eol;
			const preamble: string = content.substring(0, preambleEnd);
			const rest: string = content.substring(preambleEnd);

			result = (classification === "missing")
				? terminatePreamble(preamble, eol) + header + rest
				: preamble + header + rest.substring(this.headerSpanEnd(rest));
		}

		return result;
	}

	/**
	 * Returns the length of the outdated header block at the start of rest, counted in rest's own line endings.
	 */
	private headerSpanEnd(rest: string): number {
		const headerLines: number = normalize(rest).match(this.pattern)[0].split("\n").length - 1;
		let spanEnd: number = 0;

		for (let line: number = 0; line < headerLines; line++) {
			spanEnd = endOfLine(rest, spanEnd);
		}

		return spanEnd;
	}

}

export { SourceHeader, Classification, Analysis, YEAR_TOKEN };
