import DomUtils from "dom/DomUtils";
import { requireNotNull } from "util/Utils";

const CYDRAN_STYLES: string = `
/*
 * Cydran CSS Styles
 */
`;

class Styles {

	private element: HTMLHeadElement;

	constructor(element: HTMLHeadElement) {
		this.element = requireNotNull(element, "element");
	}

	public add(): void {
		let styleElementMissing: boolean = true;

		// eslint:disable-next-line
		for (let i = 0; i < this.element.children.length; i++) {
			const child: HTMLElement = this.element.children[i] as HTMLElement;

			if (child.tagName.toLowerCase() === "style" && child.id === "cydran-styles") {
				styleElementMissing = false;
				break;
			}
		}

		if (styleElementMissing) {
			const styleElement: HTMLStyleElement = DomUtils.createElement("style");
			styleElement.id = "cydran-styles";
			styleElement.textContent = CYDRAN_STYLES;
			this.element.insertAdjacentElement("afterbegin", styleElement);
		}

	}

}


export default Styles;
