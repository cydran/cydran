import { doc, AstPath, Doc, Options, Plugin, Printer } from "prettier";
import { printers } from "prettier/plugins/estree";
import { parsers } from "prettier/plugins/typescript";
import { requireNotNull } from "../Utils.js";

/*
 * Enforces the blank-line layout of class, interface and enum bodies by adjusting the document that the stock printer
 * builds for those bodies. Every node, including every member and its comments, is still printed by the stock printer;
 * only the line breaks around and between members change.
 *
 * Document shapes this relies on (Prettier 3.10.1), where HL is a hard line ([line(hard), break-parent]):
 *
 * - ClassBody and TSInterfaceBody (class declarations, class expressions and interfaces):
 *   - empty:              ["{", "", "}"]
 *   - members/comments:   ["{", [indent([HL, PARTS]), HL], "}"]
 *     PARTS lists the members, each printed with its leading comments, separated by one HL (no blank line) or two
 *     (one blank line). A body holding only comments has the comments as its single item. Anything that is not an HL
 *     (such as a semicolon printed between members) belongs to the member before it.
 *
 * - TSEnumBody:
 *   - empty:              group(group(["{", "", "}", "", ""]))
 *   - comments only:      group(group(["{", [indent([softline, COMMENTS]), HL], "}", "", ""]))
 *   - members:            group(["{", indent([line, [FIRST], [",", line, HL*, MEMBER], ...]), TRAILING, line, "}", "", ""])
 *     Each later member is preceded by ",", a line and one HL per blank line. TRAILING is "" or an if-break holding
 *     the trailing comma, depending on the trailing-comma setting.
 *
 * A member with leading comments (known from its AST node) is printed as [COMMENTS, NODE, ...], where COMMENTS lists
 * one part per comment: [COMMENT, HL] or [COMMENT, HL, HL] when a blank line follows it, or [COMMENT, " "] for a comment
 * on the member's own line. Every part keeps a single HL, so the comments sit together directly above the member.
 *
 * Any other shape throws UnsupportedLayoutError rather than printing output that ignores the layout rules.
 */

const LAYOUT_AST_FORMAT: string = "cydran-layout";

const PADDED_BODIES: string[] = ["ClassBody", "TSInterfaceBody"];

const ENUM_BODY: string = "TSEnumBody";

interface LayoutCounts {

	bodyPaddingLines: number;

	memberSpacingLines: number;

	enumMemberSpacingLines: number;

}

class UnsupportedLayoutError extends Error {

	constructor(nodeType: string) {
		super(`unsupported ${nodeType} layout`);
		this.name = "UnsupportedLayoutError";
	}

}

function isHardline(value: any): boolean {
	return Array.isArray(value)
		&& value.length === 2
		&& value[0]?.type === "line"
		&& value[0].hard === true
		&& value[1]?.type === "break-parent";
}

function isPlainLine(value: any): boolean {
	return value !== null && typeof value === "object" && value.type === "line" && !value.hard && !value.soft;
}

function isSoftline(value: any): boolean {
	return value !== null && typeof value === "object" && value.type === "line" && value.soft === true && !value.hard;
}

function hardlines(count: number): Doc[] {
	const lines: Doc[] = [];

	for (let index: number = 0; index < count; index++) {
		lines.push(doc.builders.hardline);
	}

	return lines;
}

function isEmptyBraces(contents: any): boolean {
	return Array.isArray(contents) && contents[0] === "{" && contents[1] === "" && contents[2] === "}";
}

/**
 * Splits the members part of a class or interface body into items, dropping the hard lines between them.
 */
function splitItems(parts: any[]): Doc[][] {
	const items: Doc[][] = [];
	let separated: boolean = true;

	for (const part of parts) {
		if (isHardline(part)) {
			separated = true;
		} else if (separated) {
			items.push([part]);
			separated = false;
		} else {
			items[items.length - 1].push(part);
		}
	}

	return items;
}

function joinItems(items: Doc[][], spacingLines: number): Doc[] {
	const joined: Doc[] = [];

	items.forEach((item, index) => {
		if (index > 0) {
			joined.push(...hardlines(spacingLines + 1));
		}

		joined.push(item);
	});

	return joined;
}

function hasLeadingComments(node: any): boolean {
	return Array.isArray(node?.comments) && node.comments.some((comment: any) => comment.leading === true);
}

/**
 * Removes every blank line between a member's leading comments and between the last of them and the member.
 */
function tightenComment(nodeType: string, part: any): Doc {
	const breaks: any[] = Array.isArray(part) ? part.slice(1) : [];
	let result: Doc = null;

	if (breaks.length > 0 && breaks.every(isHardline)) {
		result = [part[0], breaks[0]];
	} else if (breaks.length === 1 && breaks[0] === " ") {
		result = part;
	} else {
		throw new UnsupportedLayoutError(nodeType);
	}

	return result;
}

function tightenLeadingComments(nodeType: string, memberDoc: any): Doc {
	const comments: any = Array.isArray(memberDoc) ? memberDoc[0] : null;

	if (!Array.isArray(comments) || comments.length === 0) {
		throw new UnsupportedLayoutError(nodeType);
	}

	return [comments.map((part: any) => tightenComment(nodeType, part)), ...memberDoc.slice(1)];
}

/**
 * Applies tightenLeadingComments to each member doc whose AST node has leading comments.
 */
function tightenMembers(nodeType: string, memberDocs: any[], members: any[]): any[] {
	if (memberDocs.length !== members.length) {
		throw new UnsupportedLayoutError(nodeType);
	}

	return memberDocs.map((memberDoc, index) => (hasLeadingComments(members[index]) ? tightenLeadingComments(nodeType, memberDoc) : memberDoc));
}

function layoutPaddedBody(nodeType: string, node: any, printed: any, counts: LayoutCounts): Doc {
	const isBody: boolean = Array.isArray(printed) && printed.length === 3 && printed[0] === "{" && printed[2] === "}";
	const block: any = isBody ? printed[1] : null;
	const indent: any = Array.isArray(block) && block.length === 2 && isHardline(block[1]) ? block[0] : null;
	const contents: any = indent !== null && indent.type === "indent" ? indent.contents : null;
	let result: Doc = null;

	if (isBody && block === "") {
		result = printed;
	} else if (Array.isArray(contents) && contents.length === 2 && isHardline(contents[0]) && Array.isArray(contents[1])) {
		const members: any[] = Array.isArray(node.body) ? node.body : [];
		let items: Doc[][] = splitItems(contents[1]);

		if (items.length === 0) {
			throw new UnsupportedLayoutError(nodeType);
		}

		if (members.length > 0) {
			const tightened: any[] = tightenMembers(nodeType, items.map((item) => item[0]), members);

			items = items.map((item, index) => [tightened[index], ...item.slice(1)]);
		}

		result = [
			"{",
			doc.builders.indent([doc.builders.hardline, ...hardlines(counts.bodyPaddingLines), ...joinItems(items, counts.memberSpacingLines)]),
			...hardlines(counts.bodyPaddingLines),
			doc.builders.hardline,
			"}"
		];
	} else {
		throw new UnsupportedLayoutError(nodeType);
	}

	return result;
}

/**
 * Rebuilds a later enum member, [",", line, HL*, MEMBER], with exactly the configured number of blank lines.
 */
function layoutEnumMember(member: any, spacingLines: number): Doc {
	const valid: boolean = Array.isArray(member)
		&& member.length >= 3
		&& member[0] === ","
		&& isPlainLine(member[1])
		&& member.slice(2, member.length - 1).every(isHardline)
		&& !isHardline(member[member.length - 1]);

	if (!valid) {
		throw new UnsupportedLayoutError(ENUM_BODY);
	}

	return [",", member[1], ...hardlines(spacingLines), member[member.length - 1]];
}

function layoutEnumMembers(node: any, contents: any[], counts: LayoutCounts): Doc {
	const indent: any = contents[1];
	const closeIndex: number = contents.indexOf("}");
	const valid: boolean = indent?.type === "indent"
		&& Array.isArray(indent.contents)
		&& indent.contents.length >= 2
		&& isPlainLine(indent.contents[0])
		&& closeIndex > 2
		&& isPlainLine(contents[closeIndex - 1]);

	if (!valid) {
		throw new UnsupportedLayoutError(ENUM_BODY);
	}

	const first: any = indent.contents[1];

	if (!Array.isArray(first) || first.length !== 1) {
		throw new UnsupportedLayoutError(ENUM_BODY);
	}

	const later: any[] = indent.contents.slice(2).map((member: any) => layoutEnumMember(member, counts.enumMemberSpacingLines));
	const memberDocs: any[] = [first[0], ...later.map((member: any) => member[member.length - 1])];
	const tightened: any[] = tightenMembers(ENUM_BODY, memberDocs, Array.isArray(node.members) ? node.members : []);
	const laidOut: Doc[] = [[tightened[0]], ...later.map((member: any, index: number) => [...member.slice(0, member.length - 1), tightened[index + 1]])];

	return [
		"{",
		doc.builders.indent([indent.contents[0], ...hardlines(counts.bodyPaddingLines), ...laidOut]),
		...contents.slice(2, closeIndex - 1),
		...hardlines(counts.bodyPaddingLines),
		...contents.slice(closeIndex - 1)
	];
}

function layoutEnumComments(contents: any[], counts: LayoutCounts): Doc {
	const block: any = contents[1];
	const indent: any = Array.isArray(block) && block.length === 2 && isHardline(block[1]) ? block[0] : null;
	const valid: boolean = indent?.type === "indent"
		&& Array.isArray(indent.contents)
		&& indent.contents.length === 2
		&& isSoftline(indent.contents[0])
		&& contents[2] === "}";

	if (!valid) {
		throw new UnsupportedLayoutError(ENUM_BODY);
	}

	return [
		"{",
		doc.builders.indent([doc.builders.hardline, ...hardlines(counts.bodyPaddingLines), indent.contents[1]]),
		...hardlines(counts.bodyPaddingLines),
		doc.builders.hardline,
		...contents.slice(2)
	];
}

function layoutEnumBody(node: any, printed: any, counts: LayoutCounts): Doc {
	const outer: any = printed?.type === "group" ? printed : null;
	const inner: any = outer !== null && outer.contents?.type === "group" ? outer.contents : null;
	const contents: any = inner !== null ? inner.contents : (outer !== null ? outer.contents : null);
	let result: Doc = null;

	if (!Array.isArray(contents) || contents[0] !== "{") {
		throw new UnsupportedLayoutError(ENUM_BODY);
	} else if (inner !== null && isEmptyBraces(contents)) {
		result = printed;
	} else if (inner !== null) {
		result = { ...outer, contents: { ...inner, contents: layoutEnumComments(contents, counts) } };
	} else {
		result = { ...outer, contents: layoutEnumMembers(node, contents, counts) };
	}

	return result;
}

/**
 * Creates the layout plugin for the given blank-line counts. Pass it to format() as the only plugin; its typescript
 * parser routes every file to the layout printer.
 */
function createLayoutPlugin(counts: LayoutCounts): Plugin {
	requireNotNull(counts, "counts");

	const base: Printer = printers.estree;

	const printer: Printer = {
		...base,
		print(path: AstPath, options: Options, print: (path: AstPath) => Doc): Doc {
			const printed: Doc = base.print(path, options as any, print);
			const nodeType: string = path.node?.type;
			let result: Doc = printed;

			if (PADDED_BODIES.includes(nodeType)) {
				result = layoutPaddedBody(nodeType, path.node, printed, counts);
			} else if (nodeType === ENUM_BODY) {
				result = layoutEnumBody(path.node, printed, counts);
			}

			return result;
		}
	};

	return {
		parsers: {
			typescript: { ...parsers.typescript, astFormat: LAYOUT_AST_FORMAT }
		},
		printers: {
			[LAYOUT_AST_FORMAT]: printer
		}
	};
}

export { LayoutCounts, UnsupportedLayoutError, createLayoutPlugin };
