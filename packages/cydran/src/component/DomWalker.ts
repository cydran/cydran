interface DomWalker<C> {

	walk(root: HTMLElement, internals: C): void;

}

export default DomWalker;
