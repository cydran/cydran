import Renderer from "component/Renderer";
import ComponentIdPair from "component/CompnentIdPair";
import { SelectorError } from "error/Errors";
import { Attrs, TagNames, ATTRIBUTE_DELIMITER, DEFAULT_PREFIX } from "Constants";
import DomUtils from "dom/DomUtils";

const CYDRAN_PREFIX: string = DEFAULT_PREFIX + ATTRIBUTE_DELIMITER;

class StageRendererImpl implements Renderer {

	private selector: string;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	constructor(selector: string, topComponentIds: ComponentIdPair[], bottomComponentIds: ComponentIdPair[]) {
		this.selector = selector;
		this.topComponentIds = topComponentIds;
		this.bottomComponentIds = bottomComponentIds;
	}

	public render(): HTMLElement {
		const elements: NodeListOf<HTMLElement> = DomUtils.getDocument().querySelectorAll(this.selector);

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

		const regionDiv: HTMLElement = DomUtils.createElement(TagNames.CYDRAN_REGION);
		regionDiv.setAttribute(CYDRAN_PREFIX + "region" + ATTRIBUTE_DELIMITER + Attrs.NAME, "body");
		element.appendChild(regionDiv);

		for (const pair of this.bottomComponentIds) {
			const componentDiv: HTMLElement = this.cydranScriptElement(pair);
			element.appendChild(componentDiv);
		}

		return element;
	}

	private cydranScriptElement(pair: ComponentIdPair): HTMLElement {
		const retval: HTMLElement = DomUtils.createElement(TagNames.CYDRAN_REGION);
		retval.setAttribute(CYDRAN_PREFIX + "region" + ATTRIBUTE_DELIMITER + Attrs.COMPONENT, pair.componentId);
		retval.setAttribute(CYDRAN_PREFIX + "region" + ATTRIBUTE_DELIMITER + Attrs.CONTEXT, pair.contextId);
		return retval;
	}
}

export default StageRendererImpl;
