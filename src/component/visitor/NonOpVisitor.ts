import ElementVisitor from "component/visitor/ElementVisitor";

class NonOpVisitor<C> implements ElementVisitor<HTMLElement | Text | Comment, C> {

	public visit(element: HTMLElement | Text | Comment, internals: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		// Intentionally do nothing
	}

}

export default NonOpVisitor;
