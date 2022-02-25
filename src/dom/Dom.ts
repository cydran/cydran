interface Dom {

	getDocument(): Document;

	getWindow(): Window;

	createElement<E extends HTMLElement>(tagName: string): E;

	createComment(content: string): Comment;

	createDocumentFragment(): DocumentFragment;

	createTextNode(text: string): Text;

}

export default Dom;
