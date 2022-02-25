import InternalDom from "dom/InternalDom";
import DomImpl from "dom/DomImpl";
import StageRendererImpl from "component/renderer/StageRendererImpl";
import { SelectorError } from "error/Errors";

const rootSelector: string = "body";

let renderer: StageRendererImpl = null;
let dom: InternalDom;

beforeEach(() => {
	dom = new DomImpl();
});

afterEach(() => {
	dom = null;
	renderer = null;
});

test("renderer is whole and ready", () => {
	renderer = new StageRendererImpl(dom, rootSelector, [], []);
	expect(renderer).not.toBeNull();
});

test("render the template", () => {
	renderer = new StageRendererImpl(dom, rootSelector, [], []);
	const result: HTMLElement = renderer.render();
	expect(result instanceof HTMLElement).toBe(true);
	const expected: string = '<body><script type="cydran/region" c-region-name="body"></script></body>';
	expect(result.outerHTML).toEqual(expected);
});

test("render the template: throw SelectorError", () => {
	const divTag: HTMLDivElement = dom.getDocument().createElement("div");
	renderer = new StageRendererImpl(dom, "#xyz", [], []);
	expect(() => { renderer.render(); }).toThrowError(SelectorError);
});

test("render the template: other", () => {
	const idVal: string = "whack";
	const bodyTag = dom.getDocument().querySelector("body");
	for(let x: number = 0; x < 3; x++) {
		const ulTag: HTMLUListElement = dom.getDocument().createElement("ul");
		ulTag.setAttribute("id", idVal + x);

		for(let i: number = 0; i < 3; i++) {
			const liTag: HTMLLIElement = dom.getDocument().createElement("li");
			const liId: string = `${idVal}${x}-val${i}`;
			liTag.setAttribute("value", liId);
			liTag.innerHTML = liId;
			ulTag.append(liTag);
		}
		bodyTag.append(ulTag);
	}
	console.log(`bodyTag: ${ dom.getDocument().querySelector("body").outerHTML }`);

	renderer = new StageRendererImpl(dom, `#${idVal}2`, [], []);
	expect(() => { renderer.render(); }).not.toThrowError(SelectorError);
});
