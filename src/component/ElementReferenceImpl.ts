import { isDefined, requireNotNull } from "util/Utils";
import ElementReference from "component/ElementReference";
import DomOperations from "dom/DomOperations";

class ElementReferenceImpl<E extends HTMLElement> implements ElementReference<E> {

	private placeholder: Comment;

	private element: E;

	constructor(domOperations: DomOperations, root: HTMLElement, text: string) {
		requireNotNull(text, "placeholderText");
		requireNotNull(domOperations, "domOperations");
		this.placeholder = domOperations.createCommentOffDom(text);
		this.element = null;
		root.parentElement.replaceChild(this.placeholder, root);

	}

	public set(element: E): void {

		const current: HTMLElement | Text = isDefined(this.element) ? this.element : (this.placeholder as HTMLElement | Text);
		const newElement: HTMLElement = isDefined(element) ? element : null;
		const parentElement: HTMLElement = current.parentElement;
		const replacement: HTMLElement | Text = isDefined(newElement) ? element : (this.placeholder as HTMLElement | Text);

		parentElement.replaceChild(replacement, current);

		this.element = newElement as E;
	}

	public get(): E {
		return this.element;
	}

}

export default ElementReferenceImpl;
