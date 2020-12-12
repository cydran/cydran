interface ElementVisitor<E extends HTMLElement | Text | Comment, C> {
	visit(
		element: E,
		context: C,
		consumer: (element: HTMLElement | Text | Comment) => void,
		topLevel: boolean
	): void;
}

interface ElementReference<E extends HTMLElement> {
	set(element: E): void;

	get(): E;
}

interface AttributeExtractor {
	extract(element: HTMLElement, name: string): string;

	remove(element: HTMLElement, name: string): void;

	isEventAttribute(name: string): boolean;

	isMediatorAttribute(name: string): boolean;

	extractEventName(name: string): string;

	extractMediatorName(name: string): string;

	asTypePrefix(name: string): string;

	getPrefix(): string;
}

interface NamedElementOperations<E extends HTMLElement> {
	get(): E;

	focus(): void;

	blur(): void;
}

interface DomWalker<C> {
	walk(root: HTMLElement, context: C): void;
}

interface Renderer {
	render(): HTMLElement;
}

export {
	AttributeExtractor,
	DomWalker,
	ElementReference,
	ElementVisitor,
	NamedElementOperations,
	Renderer
};