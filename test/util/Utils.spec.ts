import InternalDom from "dom/InternalDom";
import DomImpl from "dom/DomImpl";
import { elementAsString, encodeHtml, clone, removeChildElements, uuidV4 } from "util/Utils";
import TagNames from "const/TagNames";


const dom: InternalDom = new DomImpl();

test("elementAsString", () => {
	const markup: string = `<div id="whatever"><ul><li>one</li></ul></div>`;
	const templateEl: HTMLTemplateElement = dom.createElement(TagNames.TEMPLATE);
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

	const template1: HTMLTemplateElement = dom.createElement(TagNames.TEMPLATE);
	template1.insertAdjacentHTML("afterbegin", markup);
	const result: HTMLElement = template1.firstElementChild as HTMLElement;

	const template2: HTMLTemplateElement = dom.createElement(TagNames.TEMPLATE);
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

	for(let x: number = 0; x < cnt; x++) {
		const result: string = uuidV4();
		expect(result).toMatch(validRegEx);
		allResults.push(result);
	}
});
