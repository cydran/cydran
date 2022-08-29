interface ElementVisitor<E extends HTMLElement | Text | Comment, C> {

	visit(element: E, internals: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void;

}

export default ElementVisitor;
