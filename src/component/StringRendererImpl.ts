import { requireNotNull } from '@/util/ObjectUtils';
import Renderer from "@/component/Renderer";
import TemplateError from "@/error/TemplateError";
import { createElementOffDom } from '@/util/DomUtils';

class StringRendererImpl implements Renderer {

	private template: string;

	constructor(template: string) {
		this.template = requireNotNull(template, "template").trim();
	}

	public render(): HTMLElement {
		const templateEl: HTMLTemplateElement = createElementOffDom("template");
		templateEl.insertAdjacentHTML("afterbegin", this.template.trim());

		if (templateEl.childElementCount !== 1) {
			const parmObj = { "%count%": "" + templateEl.childElementCount, "%template%": this.template };
			const errmsg = "Component template must have a single top level element, but had %count% top level elements:\n\n%template%\n\n";
			const error = new TemplateError(errmsg, parmObj);
			throw error;
		}

		return templateEl.firstElementChild as HTMLElement;
	}

}

export default StringRendererImpl;