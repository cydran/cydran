import {
	composite,
	compositeFn,
	partial,
	elementAsString,
	encodeHtml,
	hasMethod,
	padLeft,
	padRight,
	removeChildElements,
	uuidV4
} from 'util/Utils';
import { TagNames } from "CydranConstants";
import DomUtils from 'dom/DomUtils';
import { describe, expect, test } from '@jest/globals';
import { assertNullGuarded, assertThrown } from 'test/TestUtils';

describe("Utils", () => {

	test("composite - none", () => {
		expect(composite("foo")).toEqual("foo");
	});

	test("composite - single", () => {
		expect(composite("Hello {0}!", "Bob")).toEqual("Hello Bob!");
	});

	test("composite - multiple", () => {
		expect(composite("Hello {0} and {1}!", "Foo", "Bar")).toEqual("Hello Foo and Bar!");
	});

	test("composite - repeat", () => {
		expect(composite("The value {0} is in the set of [{0}, {1}]", "Foo", "Bar")).toEqual("The value Foo is in the set of [Foo, Bar]");
	});

	test("composite - repeat out of order", () => {
		expect(composite("The value {0} is in the set of [{1}, {0}]", "Foo", "Bar")).toEqual("The value Foo is in the set of [Bar, Foo]");
	});

	test("compositeFn - repeat out of order", () => {
		expect(compositeFn("The value {0} is in the set of [{1}, {0}]", "Foo", "Bar")()).toEqual("The value Foo is in the set of [Bar, Foo]");
	});

	test("elementAsString", () => {
		const markup: string = `<div id="whatever"><ul><li>one</li></ul></div>`;
		const templateEl: HTMLTemplateElement = DomUtils.createElement(TagNames.TEMPLATE);
		templateEl.insertAdjacentHTML("afterbegin", markup);
		const result: HTMLElement = templateEl.firstElementChild as HTMLElement;
		expect(elementAsString(result)).toEqual(`<div id="whatever">`);
	});

	test("encodeHtml", () => {
		const httpReqStr: string = `http://www.somedomain.com/buzzfeed?k="somewhere"&s=<no-cache>`;
		const expected: string = "http://www.somedomain.com/buzzfeed?k=&quot;somewhere&quot;&amp;s=&lt;no-cache&gt;";
		expect(encodeHtml(httpReqStr)).toEqual(expected);
	});

	test("removeChildElements", () => {
		const markup: string = `<div id="whatever"><ul><li>one</li></ul><ul><li>one</li></ul></div>`;

		const template1: HTMLTemplateElement = DomUtils.createElement(TagNames.TEMPLATE);
		template1.insertAdjacentHTML("afterbegin", markup);
		const result: HTMLElement = template1.firstElementChild as HTMLElement;

		const template2: HTMLTemplateElement = DomUtils.createElement(TagNames.TEMPLATE);
		template2.insertAdjacentHTML("afterbegin", markup);
		const comparator: HTMLElement = template2.firstElementChild as HTMLElement;

		removeChildElements(result);
		expect(result.children.length).toEqual(0);
		expect(comparator.children.length).toBeGreaterThan(result.children.length);
		expect(comparator.children.length).toBeGreaterThan(1);
		expect(comparator.children.length).toBe(2);
	});

	test("uuidV4", () => {
		const cnt: number = 10;
		const allResults: string[] = [];
		const validRegEx: RegExp = /^(?:(?:[A-F\d]{8})(?:\-[A-F\d]{4})(?:\-[A-F\d]{4})(?:\-[A-F\d]{4})(?:\-[A-F\d]{12}))$/;

		for (let x: number = 0; x < cnt; x++) {
			const result: string = uuidV4();
			expect(result).toMatch(validRegEx);
			allResults.push(result);
		}
	});

	test("padLeft - text shorter than desired length", () => {
		const text = "hello";
		const desiredLength = 10;
		const padCharacter = "-";
		const expected = "-----hello";
		expect(padLeft(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padRight - text shorter than desired length", () => {
		const text = "hello";
		const desiredLength = 10;
		const padCharacter = "-";
		const expected = "hello-----";
		expect(padRight(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padLeft - text equal to desired length", () => {
		const text = "hello";
		const desiredLength = 5;
		const padCharacter = "-";
		const expected = "hello";
		expect(padLeft(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padRight - text equal to desired length", () => {
		const text = "hello";
		const desiredLength = 5;
		const padCharacter = "-";
		const expected = "hello";
		expect(padRight(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padLeft - text longer than desired length", () => {
		const text = "hello";
		const desiredLength = 3;
		const padCharacter = "-";
		const expected = "hello";
		expect(padLeft(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padRight - text longer than desired length", () => {
		const text = "hello";
		const desiredLength = 3;
		const padCharacter = "-";
		const expected = "hello";
		expect(padRight(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padLeft - text is undefined", () => {
		const text = undefined;
		const desiredLength = 5;
		const padCharacter = "-";
		const expected = "-----";
		expect(padLeft(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padRight - text is undefined", () => {
		const text = undefined;
		const desiredLength = 5;
		const padCharacter = "-";
		const expected = "-----";
		expect(padRight(text, desiredLength, padCharacter)).toEqual(expected);
	});

	test("padLeft - padCharacter is not provided", () => {
		const text = "hello";
		const desiredLength = 10;
		const expected = "     hello";
		expect(padLeft(text, desiredLength, " ")).toEqual(expected);
	});

	test("padRight - padCharacter is not provided", () => {
		const text = "hello";
		const desiredLength = 10;
		const expected = "hello     ";
		expect(padRight(text, desiredLength, " ")).toEqual(expected);
	});

	test("hasMethod - instance is defined and method exists", () => {
		const instance = {
			methodName: () => { }
		};

		expect(hasMethod(instance, "methodName")).toBe(true);
	});

	test("hasMethod - instance is defined but method does not exist", () => {
		const instance = {
			otherMethod: () => { }
		};

		expect(hasMethod(instance, "methodName")).toBe(false);
	});

	test("hasMethod - instance is undefined", () => {
		const instance = undefined;

		expect(hasMethod(instance, "methodName")).toBe(false);
	});

	test("partial - null fn", () => {
		assertNullGuarded("fn", () => partial(null, 1, "Foo"));
	});

	test("partial - null position", () => {
		assertNullGuarded("position", () => partial((x) => x, null, "Foo"));
	});

	test("partial - invalid position (low)", () => {
		assertThrown(" must be a non-negative number", () => partial((x) => x, -1, "Foo"), "ValidationError");
	});

	test("partial - first value", () => {
		const originalFn: (v0: string, v1: string, v2: string) => string = (v0: string, v1: string, v2: string) => {
			return `${v0} ${v1} ${v2}`;
		}

		const updatedFn: (first: string, second:string) => string = partial(originalFn, 0, "Foo");

		expect(updatedFn("Alpha", "Beta")).toEqual("Foo Alpha Beta");
	});

	test("partial - middle value", () => {
		const originalFn: (v0: string, v1: string, v2: string) => string = (v0: string, v1: string, v2: string) => {
			return `${v0} ${v1} ${v2}`;
		}

		const updatedFn: (first: string, second:string) => string = partial(originalFn, 1, "Foo");

		expect(updatedFn("Alpha", "Beta")).toEqual("Alpha Foo Beta");
	});

	test("partial - last value", () => {
		const originalFn: (v0: string, v1: string, v2: string) => string = (v0: string, v1: string, v2: string) => {
			return `${v0} ${v1} ${v2}`;
		}

		const updatedFn: (first: string, second:string) => string = partial(originalFn, 2, "Foo");

		expect(updatedFn("Alpha", "Beta")).toEqual("Alpha Beta Foo");
	});

});
