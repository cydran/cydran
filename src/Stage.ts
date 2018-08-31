import Config from "./Config";
import {Component} from "./Core";
import DomUtils from "./DomUtils";

class Stage extends Component {

	private started: boolean;

	private rootId: string;

	private initializers: (() => void)[];

	constructor(rootId: string) {
		super("stage", () => '<div data-c-region="body"></div>');
		this.started = false;
		this.rootId = rootId;
		this.initializers = [];
		window["stage"] = this;
	}

	public withInitializer(callback: () => void): Stage {
		this.initializers.push(callback);

		return this;
	}

	protected wireListeners(): void {
		// Intentionally do nothing
	}

	public start(): void {
		this.getLogger().debug("Start Requested");

		if (this.started) {
			this.getLogger().debug("Aleady Started");
			return;
		}

		this.getLogger().debug("Cydran Starting");

		DomUtils.domReady(() => this.domReady());
	}

	private domReady(): void {
		this.getLogger().debug("DOM Ready");

		let el: HTMLElement = document.getElementById(this.rootId);
		this.setEl(el);

		this.started = true;

		this.getLogger().debug("Running initializers");

		for (var i = 0;i < this.initializers.length;i++) {
			this.initializers[i].apply(this);
		}

		this.getLogger().debug("Startup Complete");
	}

	public setComponent(component: Component): Stage {
		this.setChild("body", component);

		return this;
	}

	protected wire(): void {
		// Intentionally do nothing
	}

	protected unwire(): void {
		// Intentionally do nothing
	}

	getConfig(): Config {
		return new Config();
	}

}

export default Stage;
