import Populater from "behavior/core/each/Populater";
import { requireNotNull } from 'util/Utils';

class ElementPopulater implements Populater {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public appendChild(node: Node): void {
		this.element.appendChild(node);
	}

	public populate(): void {
		// Intentionally do nothing
	}

}

export default ElementPopulater;
