import SelectorError from "@/error/SelectorError";
import { ComponentIdPair, ComponentConfigImpl } from "@/component/ComponentConfig";
import ComponentInternalsImpl from "@/component/ComponentInternalsImpl";
import { createElementOffDom } from "@/util/DomUtils";

class StageComponentInternals extends ComponentInternalsImpl {

	protected render(): void {
		const elements: NodeListOf<HTMLElement> = window.document.querySelectorAll(this.getTemplate());
		const eLength = ((elements) ? elements.length : 0);
		const errMsg = (eLength !== 1) ? "CSS selector MUST identify single HTMLElement: '%pattern%' - %qty% found" : null;

		if (errMsg) {
			const patSubObj = { "%pattern%": this.getTemplate(), "%qty%": eLength };
			const error: SelectorError = new SelectorError(errMsg, patSubObj);
			this.getLogger().fatal(error);
			throw error;
		}

		const element: HTMLElement = elements[0];
		const topIds: ComponentIdPair[] = (this.getConfig() as ComponentConfigImpl).getTopComponentIds();
		const bottomIds: ComponentIdPair[] = (this.getConfig() as ComponentConfigImpl).getBottomComponentIds();

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		for (const pair of topIds) {
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
		this.setEl(element);

		for (const pair of bottomIds) {
			const componentDiv: HTMLElement = createElementOffDom("script");
			componentDiv.setAttribute("type", "cydran/region");
			componentDiv.setAttribute("c:component", pair.componentId);
			componentDiv.setAttribute("c:module", pair.moduleId);
			element.appendChild(componentDiv);
		}
	}

	protected validateModulePresent(): void {
		// Intentionally do nothing
	}

}

export default StageComponentInternals;
