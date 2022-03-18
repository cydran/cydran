/**
 * Consistent interface to an HTML DOM representation
 */
interface Dom {
	/**
	 * Get the document reference
	 * @returns JS Document object
	 */
	getDocument(): Document;

	/**
	 * Get the client JS Window reference
	 * @returns client JS Window object
	 */
	getWindow(): Window;

	/**
	 * Creates an HTMLElement object
	 * @param tagName - html tag name
	 * @returns - a JS HTMLElement&lt;E&gt; object
	 */
	createElement<E extends HTMLElement>(tagName: string): E;

	/**
	 * Create a comment object
	 * @param content - text for the comment
	 * @return - HTML Comment object
	 */
	createComment(content: string): Comment;

	/**
	 * Create an HTML DocumentFragment object
	 * @returns - HTML DocumentFragment object
	 */
	createDocumentFragment(): DocumentFragment;

	/**
	 * Create an HTML Text object
	 * @param text - HTML Text object for DOM inclusion
	 * @returns - HTML Text object
	 */
	createTextNode(text: string): Text;

}

export default Dom;
