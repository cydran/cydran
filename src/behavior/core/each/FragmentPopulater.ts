import Populater from "behavior/core/each/Populater";
import Dom from "dom/Dom";
import { requireNotNull } from 'util/Utils';

class FragmentPopulater implements Populater {

	private dom: Dom;

	private element: HTMLElement;

	private fragment: DocumentFragment;

	constructor(element: HTMLElement, dom: Dom) {
		this.dom = requireNotNull(dom, "dom");
		this.element = requireNotNull(element, "element");
		this.fragment = dom.createDocumentFragment();
	}

	public appendChild(node: Node): void {
		this.fragment.appendChild(node);
	}

	public populate(): void {
		this.element.appendChild(this.fragment);
		this.fragment = this.dom.createDocumentFragment();
	}

}

export default FragmentPopulater;
