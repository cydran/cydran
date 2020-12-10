import Renderer from "component/Renderer";
import { requireNotNull, createElementOffDom } from "util/Utils";
import { TemplateError } from "error/Errors";
import TagNames from "const/TagNames";

class StringRendererImpl implements Renderer {
	private template: string;

	constructor(template: string) {
		this.template = requireNotNull(template, TagNames.TEMPLATE).trim();
	}

	public render(): HTMLElement {
		const templateEl: HTMLTemplateElement = createElementOffDom(TagNames.TEMPLATE);
		templateEl.insertAdjacentHTML("afterbegin", this.template);

		if (templateEl.childElementCount !== 1) {
			throw new TemplateError(`Component template must have a single top level element, but had ${templateEl.childElementCount} top level elements:\n\n${this.template}\n\n`);
		}

		return templateEl.firstElementChild as HTMLElement;
	}
}

export default StringRendererImpl;
