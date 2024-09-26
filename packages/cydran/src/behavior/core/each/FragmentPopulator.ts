import Populator from "behavior/core/each/Populator";
import DomUtils from "dom/DomUtils";
import { requireNotNull } from 'util/Utils';

class FragmentPopulator implements Populator {

	private element: HTMLElement;

	private fragment: DocumentFragment;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
		this.fragment = DomUtils.createDocumentFragment();
	}

	public appendChild(node: Node): void {
		this.fragment.appendChild(node);
	}

	public populate(): void {
		this.element.appendChild(this.fragment);
		this.fragment = DomUtils.createDocumentFragment();
	}

}

export default FragmentPopulator;
