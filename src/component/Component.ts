interface Component {

	setEl(el: HTMLElement): void;

	setParentView(parentView: Component): void;

	dispose(): void;

}

export default Component;