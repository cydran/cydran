import { createElementOffDom } from "@/util/DomUtils";
import SelectorError from "@/error/SelectorError";
import ComponentIdPair from "@/component/ComponentIdPair";
import Renderer from "@/component/Renderer";

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
		const elements: NodeListOf<HTMLElement> = window.document.querySelectorAll(this.selector);
		const eLength = ((elements) ? elements.length : 0);
		const errMsg = (eLength !== 1) ? "CSS selector MUST identify single HTMLElement: '%pattern%' - %qty% found" : null;

		if (errMsg) {
			const patSubObj = { "%pattern%": this.selector, "%qty%": eLength };
			throw new SelectorError(errMsg, patSubObj);
		}

		const element: HTMLElement = elements[0];

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		for (const pair of this.topComponentIds) {
			const componentDiv: HTMLElement = createElementOffDom("script");
			componentDiv.setAttribute("type", "cydran/region");
			componentDiv.setAttribute("c:component", pair.componentId);
			componentDiv.setAttribute("c:module", pair.moduleId);
			element.appendChild(componentDiv);
		}

		const regionDiv: HTMLElement = createElementOffDom("script");
		regionDiv.setAttribute("type", "cydran/region");
		regionDiv.setAttribute("c:name", "body");
		element.appendChild(regionDiv);

		for (const pair of this.bottomComponentIds) {
			const componentDiv: HTMLElement = createElementOffDom("script");
			componentDiv.setAttribute("type", "cydran/region");
			componentDiv.setAttribute("c:component", pair.componentId);
			componentDiv.setAttribute("c:module", pair.moduleId);
			element.appendChild(componentDiv);
		}

		return element;
	}

}

export default StageRendererImpl;
