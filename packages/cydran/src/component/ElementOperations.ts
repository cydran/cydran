interface ElementOperations<E extends HTMLElement> {

	get(): E;

	focus(): void;

	blur(): void;

}

export default ElementOperations;
