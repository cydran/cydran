import ElementOperations from "component/ElementOperations";
import { requireNotNull } from "util/Utils";

class ElementOperationsImpl<E extends HTMLElement> implements ElementOperations<E> {

	private element: E;

	constructor(element: E) {
		this.element = requireNotNull(element, "element");
	}

	public get(): E {
		return this.element;
	}

	public focus(): void {
		setTimeout(() => {
			this.element.focus();
		}, 1);
	}

	public blur(): void {
		setTimeout(() => {
			this.element.blur();
		}, 1);
	}
}

export default ElementOperationsImpl;
