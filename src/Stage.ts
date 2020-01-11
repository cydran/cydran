import { ComponentIdPair } from "@/ComponentConfig";
import { Component, DEFAULT_MODULE_KEY, INTERNAL_DIRECT_CHANNEL_NAME, Modules, StageComponent } from "@/Core";
import CydranConfig from "@/CydranConfig";
import DomUtils from "@/DomUtils";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ObjectUtils from "@/ObjectUtils";
import { VALID_SERVICE_LOCATOR_ID } from "@/ValidationRegExp";

const requireNotNull = ObjectUtils.requireNotNull;
const requireValid = ObjectUtils.requireValid;

interface StageBuilder {

	withComponentBefore(id: string, moduleName?: string): StageBuilder;

	withComponentAfter(id: string, moduleName?: string): StageBuilder;

	withComponent(id: string): StageBuilder;

	withInitializer(callback: () => void): StageBuilder;

	withTraceLogging(): StageBuilder;

	withDebugLogging(): StageBuilder;

	withInfoLogging(): StageBuilder;

	withWarnLogging(): StageBuilder;

	withErrorLogging(): StageBuilder;

	withFatalLogging(): StageBuilder;

	withLoggingDisabled(): StageBuilder;

	build(): Stage;

}

class StageBuilderImpl implements StageBuilder {

	private config: CydranConfig;

	private instance: StageImpl;

	constructor(rootSelector: string) {
		this.config = new CydranConfig();
		this.instance = new StageImpl(rootSelector);
	}

	public withComponentBefore(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentBefore(id, moduleName);
		return this;
	}

	public withComponentAfter(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentAfter(id, moduleName);
		return this;
	}

	public withComponent(id: string, moduleName?: string): StageBuilder {
		return this.withComponentAfter(id, moduleName);
	}

	public withInitializer(callback: () => void): StageBuilder {
		this.instance.withInitializer(callback);
		return this;
	}

	public withTraceLogging(): StageBuilder {
		this.config.useTrace();
		return this;
	}

	public withDebugLogging(): StageBuilder {
		this.config.useDebug();
		return this;
	}

	public withInfoLogging(): StageBuilder {
		this.config.useInfo();
		return this;
	}

	public withWarnLogging(): StageBuilder {
		this.config.useWarn();
		return this;
	}

	public withErrorLogging(): StageBuilder {
		this.config.useError();
		return this;
	}

	public withFatalLogging(): StageBuilder {
		this.config.useFatal();
		return this;
	}

	public withLoggingDisabled(): StageBuilder {
		this.config.useDisabled();
		return this;
	}

	public build(): Stage {
		return this.instance;
	}

}

interface Stage {

	setComponent(component: Component): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	get<T>(id: string): T;

	start(): void;

}

class StageImpl implements Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: Array<(() => void)>;

	private root: StageComponent;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	constructor(rootSelector: string) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.logger = LoggerFactory.getLogger("Stage");
		this.started = false;
		this.initializers = [];
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.root = null;
	}

	public withInitializer(callback: () => void): Stage {
		requireNotNull(callback, "callback");
		this.initializers.push(callback);

		return this;
	}

	public withComponentBefore(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_SERVICE_LOCATOR_ID);
		this.topComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public withComponentAfter(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_SERVICE_LOCATOR_ID);
		this.bottomComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public start(): void {
		this.logger.debug("Start Requested");

		if (this.started) {
			this.logger.debug("Aleady Started");
			return;
		}

		this.logger.debug("Cydran Starting");
		Modules.registerConstant("stage", this);
		DomUtils.domReady(() => this.domReady());
	}

	public setComponent(component: Component): Stage {
		this.root.setChild("body", component);
		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.root.setChildFromRegistry("body", componentName, defaultComponentName);
		return this;
	}

	public get<T>(id: string): T {
		requireValid(id, "id", VALID_SERVICE_LOCATOR_ID);
		return this.root.get(id);
	}

	private domReady(): void {
		this.logger.debug("DOM Ready");
		this.root = new StageComponent(this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
		this.started = true;
		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this);
		}

		this.logger.debug("Startup Complete");
	}

}

const builder = function(rootSelector: string): StageBuilder {
	return new StageBuilderImpl(rootSelector);
};

export { builder, Stage, StageImpl };
