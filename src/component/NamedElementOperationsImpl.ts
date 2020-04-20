import NamedElementOperations from "@/component/NamedElementOperations";

class NamedElementOperationsImpl<E extends HTMLElement> implements NamedElementOperations<E> {

	private element: E;

	constructor(element: E) {
		this.element = element;
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

export default NamedElementOperationsImpl;
