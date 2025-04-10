import Populator from "behavior/core/each/Populator";
import { requireNotNull } from 'util/Utils';

class ElementPopulator implements Populator {

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

export default ElementPopulator;
