interface DomOperations {

	getDocument(): Document;

	getWindow(): Window;

	createElementOffDom<E extends HTMLElement>(tagName: string): E;

	createCommentOffDom(content: string): Comment;

	createDocumentFragmentOffDom(): DocumentFragment;

	createTextNodeOffDom(text: string): Text;

}

export default DomOperations;
