interface ElementReference<E extends HTMLElement> {

	set(element: E): void;

	get(): E;

}

export default ElementReference;