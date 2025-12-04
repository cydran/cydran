
import ComponentInternals from "component/ComponentInternals";
import ElementVisitor from "component/visitor/ElementVisitor";
import DomUtils from "dom/DomUtils";
import ComponentStylesElement from "element/ComponentStylesElement";
import { defaulted } from "util/Utils";

class ComponentStylesVisitor implements ElementVisitor<ComponentStylesElement, ComponentInternals> {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public visit(element: HTMLElement | Text | Comment, internals: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const style: HTMLStyleElement = DomUtils.createElement("style");
		const css: string = defaulted(internals.getStyles(), "");
		style.innerText = css;

		element.replaceWith(style);
	}

}

export default ComponentStylesVisitor;
