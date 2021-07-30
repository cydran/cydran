interface DomWalker<C> {

	walk(root: HTMLElement, context: C): void;

}

export default DomWalker;