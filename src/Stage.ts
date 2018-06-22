import AbstractContainerView from "./ContainerComponent";
import View from "./Component";
import DomUtils from "./DomUtils";

class Stage extends AbstractContainerView {

	private started: boolean;

	private rootId: string;

	private initializers: (() => void)[];

	constructor(rootId: string) {
		super('stage', () => '<div data-c-region="body"></div>', 'body');
		this.started = false;
		this.rootId = rootId;
		this.initializers = [];
		window['stage'] = this;
	}

	public withInitializer(callback: () => void): Stage {
		this.initializers.push(callback);

		return this;
	}

	public start(): void {
		if (this.started) {
			return;
		}

		DomUtils.domReady(() => this.domReady());
	}

	private domReady(): void {
		let el: HTMLElement = document.getElementById(this.rootId);
		this.setEl(el);
		this.started = true;

		for (var i = 0;i < this.initializers.length;i++) {
			this.initializers[i].apply(this);
		}
	}

	public setView(view: View): void {
		if (this.started == false) {
			// TODO - Use a custom exception
			throw new Error("Application not started");
		}

		this.getRegion('body').setView(view);
	}

	protected addStaticChildren(): void {
		// Intentionally do nothing
	}

}

export default Stage;