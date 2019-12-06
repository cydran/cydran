import Config from "./Config";
import { Component, INTERNAL_DIRECT_CHANNEL_NAME, StageComponent } from "./Core";
import DomUtils from "./DomUtils";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";

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
		this.root = null;
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
		this.root = new StageComponent(this.rootSelector);
		this.root.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
		this.started = true;
		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this);
		}

		this.logger.debug("Startup Complete");
	}

}

export default Stage;
