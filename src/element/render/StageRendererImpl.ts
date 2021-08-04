import Renderer from "element/Renderer";
import ComponentIdPair from "component/CompnentIdPair";
import { createElementOffDom } from "util/Utils";
import { SelectorError } from "error/Errors";
import Attrs from "const/AttrsFields";

class StageRendererImpl implements Renderer {
	private readonly REGION_TAG: string = "script";
	private readonly REGION_TYPE: string = "cydran/region";
	private selector: string;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	constructor(
		selector: string,
		topComponentIds: ComponentIdPair[],
		bottomComponentIds: ComponentIdPair[]
	) {
		this.selector = selector;
		this.topComponentIds = topComponentIds;
		this.bottomComponentIds = bottomComponentIds;
	}

	public render(): HTMLElement {
		const elements: NodeListOf<HTMLElement> = window.document.querySelectorAll(
			this.selector
		);
		const eLength = elements ? elements.length : 0;
		if (eLength !== 1) {
			throw new SelectorError(
				`CSS selector MUST identify single HTMLElement: '${this.selector}' - ${eLength} found`
			);
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

		const regionDiv: HTMLElement = createElementOffDom(this.REGION_TAG);
		regionDiv.setAttribute(Attrs.TYPE, this.REGION_TYPE);
		regionDiv.setAttribute(this.cydranPrefix + Attrs.NAME, "body");
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
