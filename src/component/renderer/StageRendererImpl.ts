import Renderer from "component/Renderer";
import ComponentIdPair from "component/CompnentIdPair";
import { requireNotNull } from "util/Utils";
import { SelectorError } from "error/Errors";
import Attrs from "const/AttrsFields";
import MimeTypes from "const/MimeTypes";
import TagNames from "const/TagNames";
import { ATTRIBUTE_DELIMITER, DEFAULT_PREFIX } from "const/HardValues";
import Dom from "dom/Dom";

const CYDRAN_PREFIX: string = DEFAULT_PREFIX + ATTRIBUTE_DELIMITER;

class StageRendererImpl implements Renderer {

	private selector: string;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private dom: Dom;

	constructor(dom: Dom, selector: string, topComponentIds: ComponentIdPair[], bottomComponentIds: ComponentIdPair[]) {
		this.selector = selector;
		this.topComponentIds = topComponentIds;
		this.bottomComponentIds = bottomComponentIds;
		this.dom = requireNotNull(dom, "dom");
	}

	public render(): HTMLElement {
		const elements: NodeListOf<HTMLElement> = this.dom.getDocument().querySelectorAll(this.selector);

		const eLength = elements ? elements.length : 0;

		if (eLength !== 1) {
			throw new SelectorError(`CSS selector MUST identify single HTMLElement: '${this.selector}' - ${eLength} found`);
		}

		const element: HTMLElement = elements[0];

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		for (const pair of this.topComponentIds) {
			const componentDiv: HTMLElement = this.cydranScriptElement(pair);
			element.appendChild(componentDiv);
		}

		const regionDiv: HTMLElement = this.dom.createElement(TagNames.SCRIPT);
		regionDiv.setAttribute(Attrs.TYPE, MimeTypes.CYDRAN_REGION);
		regionDiv.setAttribute(CYDRAN_PREFIX + "region" + ATTRIBUTE_DELIMITER + Attrs.NAME, "body");
		element.appendChild(regionDiv);

		for (const pair of this.bottomComponentIds) {
			const componentDiv: HTMLElement = this.cydranScriptElement(pair);
			element.appendChild(componentDiv);
		}

		return element;
	}

	private cydranScriptElement(pair: ComponentIdPair): HTMLElement {
		const retval: HTMLElement = this.dom.createElement(TagNames.SCRIPT);
		retval.setAttribute(Attrs.TYPE, MimeTypes.CYDRAN_REGION);
		retval.setAttribute(CYDRAN_PREFIX + "region" + ATTRIBUTE_DELIMITER + Attrs.COMPONENT, pair.componentId);
		retval.setAttribute(CYDRAN_PREFIX + "region" + ATTRIBUTE_DELIMITER + Attrs.CONTEXT, pair.contextId);
		return retval;
	}
}

export default StageRendererImpl;
