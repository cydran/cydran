import { Component, INTERNAL_DIRECT_CHANNEL_NAME, StageComponent } from "@/Core";
import CydranConfig from "@/CydranConfig";
import DomUtils from "@/DomUtils";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ObjectUtils from "@/ObjectUtils";

const requireNotNull = ObjectUtils.requireNotNull;

class Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: Array<(() => void)>;

	private root: StageComponent;

	constructor(rootSelector: string) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.logger = LoggerFactory.getLogger("Stage");
		this.started = false;
		this.initializers = [];
		this.root = null;
	}

	public withInitializer(callback: () => void): Stage {
		requireNotNull(callback, "callback");
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
		requireNotNull(id, "id");
		return this.root.get(id);
	}

	public getConfig(): CydranConfig {
		return new CydranConfig();
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
