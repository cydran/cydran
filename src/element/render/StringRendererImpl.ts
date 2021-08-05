import Renderer from "element/Renderer";
import { requireNotNull, createElementOffDom } from "util/Utils";
import { TemplateError } from "error/Errors";

class StringRendererImpl implements Renderer {
	private readonly TEMPLATE_TAG_NAME: string = "template";
	private template: string;

	constructor(template: string) {
		this.template = requireNotNull(template, "template").trim();
	}

	public render(): HTMLElement {
		const templateEl: HTMLTemplateElement = createElementOffDom(this.TEMPLATE_TAG_NAME);
		templateEl.insertAdjacentHTML("afterbegin", this.template);

		if (templateEl.childElementCount !== 1) {
			throw new TemplateError(`Component template must have a single top level element, but had ${templateEl.childElementCount} top level elements:\n\n${this.template}\n\n`);
		}

		return templateEl.firstElementChild as HTMLElement;
	}
}

export default StringRendererImpl;
