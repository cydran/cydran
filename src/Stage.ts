import Config from "./Config";
import {Component} from "./Core";
import DomUtils from "./DomUtils";

class Stage extends Component {

	private started: boolean;

	private rootSelector: string;

	private initializers: Array<(() => void)>;

	constructor(rootSelector: string) {
		super("stage", () => '<div data-c-region="body"></div>');
		this.started = false;
		this.rootSelector = rootSelector;
		this.initializers = [];
	}

	public withInitializer(callback: () => void): Stage {
		this.initializers.push(callback);

		return this;
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

	public setComponent(component: Component): Stage {
		this.setChild("body", component);

		return this;
	}

	public getConfig(): Config {
		return new Config();
	}

	protected wire(): void {
		// Intentionally do nothing
	}

	protected unwire(): void {
		// Intentionally do nothing
	}

	private domReady(): void {
		this.getLogger().debug("DOM Ready");

		const el: HTMLElement = document.querySelector(this.rootSelector);
		if(el) {
			this.setEl(el);

			this.started = true;

			this.getLogger().debug("Running initializers");

			for (const initializer of this.initializers) {
				initializer.apply(this);
			}

			this.getLogger().debug("Startup Complete");
		} else {
			this.getLogger().error("Invalid CSS seletor pattern provided: " + this.rootSelector);
		}
	}

}

export default Stage;
