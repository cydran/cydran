import Renderer from "element/Renderer";
import { requireNotNull, createElementOffDom } from "util/Utils";
import { TemplateError } from "error/Errors";

class StringRendererImpl implements Renderer {
	private template: string;

	constructor(template: string) {
		this.template = requireNotNull(template, "template").trim();
	}

	public render(): HTMLElement {
		const templateEl: HTMLTemplateElement = createElementOffDom("template");
		templateEl.insertAdjacentHTML("afterbegin", this.template.trim());

		if (templateEl.childElementCount !== 1) {
			throw new TemplateError(`Component template must have a single top level element, but had ${templateEl.childElementCount} top level elements:\n\n${this.template}\n\n`);
		}

		return templateEl.firstElementChild as HTMLElement;
	}
}

export default StringRendererImpl;
