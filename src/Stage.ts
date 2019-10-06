import Config from "./Config";
import { Component } from "./Core";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import DomUtils from "./DomUtils";
import { SelectorError } from "./Errors";

class StageComponent extends Component {

	private started: boolean;

	private rootSelector: string;

	private initializers: Array<(() => void)>;

	constructor() {
		super("stage", '<div><div data-c-region="body"></div></div>');
	}

	public setComponent(component: Component): StageComponent {
		this.setChild("body", component);

		return this;
	}

}

class Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: Array<(() => void)>;

	private root: StageComponent;

	constructor(rootSelector: string) {
		this.logger = LoggerFactory.getLogger("Stage");
		this.started = false;
		this.rootSelector = rootSelector;
		this.initializers = [];
		this.root = new StageComponent();
	}

	public withInitializer(callback: () => void): Stage {
		this.initializers.push(callback);

		return this;
	}

	public start(): void {
		this.logger.debug("Start Requested");

		if (this.started) {
			this.logger.debug("Aleady Started");
			return;
		}

		this.logger.debug("Cydran Starting");

		DomUtils.domReady(() => this.domReady());
	}

	public setComponent(component: Component): Stage {
		this.root.setChild("body", component);

		return this;
	}

	public get<T>(id: string): T {
		return this.root.get(id);
	}

	public getConfig(): Config {
		return new Config();
	}

	private domReady(): void {
		this.logger.debug("DOM Ready");
		const elements: NodeListOf<HTMLElement> = document.querySelectorAll(this.rootSelector);

		if (elements.length === 0) {
			this.logger.fatal("Invalid CSS seletor pattern provided: " + this.rootSelector);
			throw new SelectorError("Invalid CSS seletor pattern provided: " + this.rootSelector);
		}

		if (elements.length > 1) {
			this.logger.fatal("CSS selector pattern provided is NOT unique: " + this.rootSelector);
			throw new SelectorError("CSS selector pattern provided is NOT unique: " + this.rootSelector);
		}

		const element: HTMLElement = elements[0];

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		this.root.setParent(null);
		element.appendChild(this.root.getEl());

		this.started = true;

		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this);
		}

		this.logger.debug("Startup Complete");
	}

}

export default Stage;
