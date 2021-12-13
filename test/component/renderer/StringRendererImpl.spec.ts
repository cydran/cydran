import InternalDom from "dom/InternalDom";
import DomImpl from "dom/DomImpl";
import StringRendererImpl from "component/renderer/StringRendererImpl";
import { TemplateError } from "error/Errors";

const dom: InternalDom = new DomImpl();

let renderer: StringRendererImpl = null;

afterEach(() => {
	renderer = null;
});

test("renderer is whole and ready", () => {
	renderer = new StringRendererImpl(dom, "<div></div>");
	expect(renderer).not.toBe(null);
});

test("render the template", () => {
	renderer = new StringRendererImpl(dom, "<div></div>");
	const result: HTMLElement = renderer.render();
	expect(result instanceof HTMLDivElement).toBe(true);
});

test("attempt render bad template", () => {
	renderer = new StringRendererImpl(dom, "<div></div><div></div>");
	expect(() => renderer.render()).toThrowError(TemplateError);
});
