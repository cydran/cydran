import InternalDom from "dom/InternalDom";
import DomImpl from "dom/DomImpl";
import StageRendererImpl from "component/renderer/StageRendererImpl";

const dom: InternalDom = new DomImpl();
const rootSelector: string = "body";

let renderer: StageRendererImpl = null;
let wkElem: HTMLElement = null;

beforeEach(() => {
	//
});

afterEach(() => {
	renderer = null;
});

test("renderer is whole and ready", () => {
	renderer = new StageRendererImpl(dom, rootSelector, [], []);
	expect(renderer).not.toBe(null);
});

test("render the template", () => {
	renderer = new StageRendererImpl(dom, rootSelector, [], []);
	const result: HTMLElement = renderer.render();
	expect(result instanceof HTMLElement).toBe(true);
});
