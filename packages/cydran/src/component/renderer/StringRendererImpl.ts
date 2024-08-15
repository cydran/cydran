import Renderer from "component/Renderer";
import { requireNotNull } from "util/Utils";
import { TemplateError } from "error/Errors";
import TagNames from "const/TagNames";
import DomUtils from "dom/DomUtils";

class StringRendererImpl implements Renderer {

	private template: string;

	constructor(template: string) {
		this.template = requireNotNull(template, TagNames.TEMPLATE).trim();
	}

	public render(): HTMLElement {
		const templateEl: HTMLTemplateElement = DomUtils.createElement(TagNames.TEMPLATE);
		templateEl.insertAdjacentHTML("afterbegin", this.template);

		if (templateEl.childNodes.length !== 1) {
			throw new TemplateError(`1 (one) required top level node permitted. Text and comment nodes at the top level are not permitted. ${ templateEl.childNodes.length } nodes found for:\n\n${ this.template }\n\n`);
		}

		return templateEl.firstElementChild as HTMLElement;
	}

}

export default StringRendererImpl;
