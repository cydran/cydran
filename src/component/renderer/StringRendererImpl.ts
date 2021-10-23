import Renderer from "component/Renderer";
import { requireNotNull } from "util/Utils";
import { TemplateError } from "error/Errors";
import TagNames from "const/TagNames";
import DomOperations from 'dom/DomOperations';

class StringRendererImpl implements Renderer {

	private template: string;

	private domOperations: DomOperations;

	constructor(domOperations: DomOperations, template: string) {
		this.domOperations = requireNotNull(domOperations, "domOperations");
		this.template = requireNotNull(template, TagNames.TEMPLATE).trim();
	}

	public render(): HTMLElement {
		const templateEl: HTMLTemplateElement = this.domOperations.createElementOffDom(TagNames.TEMPLATE);
		templateEl.insertAdjacentHTML("afterbegin", this.template);

		if (templateEl.childElementCount !== 1) {
			throw new TemplateError(`Component template must have a single top level element, but had ${templateEl.childElementCount} top level elements:\n\n${this.template}\n\n`);
		}

		return templateEl.firstElementChild as HTMLElement;
	}

}

export default StringRendererImpl;
