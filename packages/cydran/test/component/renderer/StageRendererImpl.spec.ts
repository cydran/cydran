import StageRendererImpl from "component/renderer/StageRendererImpl";
import { SelectorError } from "error/Errors";
import DomUtils from 'dom/DomUtils';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

const rootSelector: string = "body";

let renderer: StageRendererImpl = null;

describe("StageRendererImpl", () => {

	beforeEach(() => {
		// Intentionally do nothing
	});

	afterEach(() => {
		renderer = null;
	});

	test("renderer is whole and ready", () => {
		renderer = new StageRendererImpl(rootSelector, [], []);
		expect(renderer).not.toBeNull();
	});

	test("render the template", () => {
		renderer = new StageRendererImpl(rootSelector, [], []);
		const result: HTMLElement = renderer.render();
		expect(result instanceof HTMLElement).toBe(true);
		const expected: string = '<body><c-region name="body"></c-region></body>';
		expect(result.outerHTML).toEqual(expected);
	});

	test("render the template: throw SelectorError", () => {
		const divTag: HTMLDivElement = DomUtils.getDocument().createElement("div");
		renderer = new StageRendererImpl("#xyz", [], []);
		expect(() => { renderer.render(); }).toThrowError(SelectorError);
	});

	test("render the template: other", () => {
		const idVal: string = "whack";
		const bodyTag = DomUtils.getDocument().querySelector("body");
		for (let x: number = 0; x < 3; x++) {
			const ulTag: HTMLUListElement = DomUtils.getDocument().createElement("ul");
			ulTag.setAttribute("id", idVal + x);

			for (let i: number = 0; i < 3; i++) {
				const liTag: HTMLLIElement = DomUtils.getDocument().createElement("li");
				const liId: string = `${idVal}${x}-val${i}`;
				liTag.setAttribute("value", liId);
				liTag.innerHTML = liId;
				ulTag.append(liTag);
			}
			bodyTag.append(ulTag);
		}
		console.log(`bodyTag: ${DomUtils.getDocument().querySelector("body").outerHTML}`);

		renderer = new StageRendererImpl(`#${idVal}2`, [], []);
		expect(() => { renderer.render(); }).not.toThrowError(SelectorError);
	});

});
