import InternalDom from "dom/InternalDom";
import DomImpl from "dom/DomImpl";
import IdentityRendererImpl from "component/renderer/IdentityRendererImpl";

const dom: InternalDom = new DomImpl();

let renderer: IdentityRendererImpl = null;
let wkElem: HTMLElement = null;

beforeEach(() => {
	wkElem = dom.createElement("div");
});

afterEach(() => {
	renderer = null;
	wkElem = null;
});

test("renderer is whole and ready", () => {
	renderer = new IdentityRendererImpl(wkElem);
	expect(renderer).not.toBeNull();
});

test("render the template", () => {
	renderer = new IdentityRendererImpl(wkElem);
	const result: HTMLElement = renderer.render();
	expect(result instanceof HTMLDivElement).toBe(true);
});
