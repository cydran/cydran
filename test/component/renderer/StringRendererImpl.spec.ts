import StringRendererImpl from "component/renderer/StringRendererImpl";
import { TemplateError } from "error/Errors";

let renderer: StringRendererImpl = null;

afterEach(() => {
	renderer = null;
});

test("renderer is whole and ready", () => {
	renderer = new StringRendererImpl("<div></div>");
	expect(renderer).not.toBeNull();
});

test("render the template", () => {
	renderer = new StringRendererImpl("<div></div>");
	const result: HTMLElement = renderer.render();
	expect(result instanceof HTMLDivElement).toBe(true);
});

test("attempt render bad template - Two top level elements", () => {
	renderer = new StringRendererImpl("<div></div><div></div>");
	expect(() => renderer.render()).toThrowError(TemplateError);
});

test("attempt render bad template - text above", () => {
	renderer = new StringRendererImpl("This shouldn't be here<div></div>");
	expect(() => renderer.render()).toThrowError(TemplateError);
});

test("attempt render bad template - text after", () => {
	renderer = new StringRendererImpl("<div></div>This shouldn't be here");
	expect(() => renderer.render()).toThrowError(TemplateError);
});

test("attempt render bad template - comment above", () => {
	renderer = new StringRendererImpl("<!-- This shouldn't be here --><div></div>");
	expect(() => renderer.render()).toThrowError(TemplateError);
});

test("attempt render bad template - comment after", () => {
	renderer = new StringRendererImpl("<div></div><!-- This shouldn't be here -->");
	expect(() => renderer.render()).toThrowError(TemplateError);
});
