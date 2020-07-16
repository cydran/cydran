import { Stage } from "@/stage/Interfaces";
import Logger from "@/logger/Logger";
import ComponentIdPair from "@/component/ComponentIdPair";
import ModulesContext from "@/module/ModulesContext";
import { requireNotNull, requireValid } from "@/util/ObjectUtils";
import LoggerFactory from "@/logger/LoggerFactory";
import ModulesContextImpl from "@/module/ModulesContextImpl";
import { VALID_ID } from "@/constant/ValidationRegExp";
import { DEFAULT_MODULE_KEY, INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Nestable from "@/component/Nestable";
import { domReady } from "@/util/DomUtils";
import Module from "@/module/Module";
import Type from "@/type/Type";
import Scope from "@/model/Scope";
import { MutableProperties } from "@/properties/Interfaces";
import Renderer from "@/component/Renderer";
import StageRendererImpl from "@/stage/StageRendererImpl";
import RootComponent from "@/stage/RootComponent";

class StageImpl implements Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: ((stage?: Stage) => void)[];

	private root: RootComponent;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private modules: ModulesContext;

	constructor(rootSelector: string) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.logger = LoggerFactory.getLogger("Stage");
		this.modules = new ModulesContextImpl();
		this.started = false;
		this.initializers = [];
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.root = null;
	}

	public withInitializer(callback: (stage?: Stage) => void): Stage {
		requireNotNull(callback, "callback");
		this.initializers.push(callback);
		return this;
	}

	public withComponentBefore(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_ID);

		this.topComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public withComponentAfter(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_ID);

		this.bottomComponentIds.push({
			componentId: id,
			moduleId: moduleName || DEFAULT_MODULE_KEY
		});
	}

	public start(): Stage {
		this.logger.debug("Start Requested");

		if (this.started) {
			this.logger.debug("Aleady Started");
			return this;
		}

		this.logger.debug("Cydran Starting");
		this.modules.registerConstant("stage", this);
		domReady(() => this.domReady());

		return this;
	}

	public setComponent(component: Nestable): Stage {
		this.root.setChild("body", component);
		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.root.setChildFromRegistry("body", componentName, defaultComponentName);
		return this;
	}

	public get<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		return this.root.get(id);
	}

	public getModules(): ModulesContext {
		return this.modules;
	}

	public getModule(name: string): Module {
		return this.modules.getModule(name);
	}

	public getDefaultModule(): Module {
		return this.modules.getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): void {
		this.modules.forEach(fn);
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.modules.broadcast(channelName, messageName, payload);
	}

	public registerConstant(id: string, instance: any): void {
		this.modules.registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.modules.registerPrototype(id, classInstance, dependencies);
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.modules.registerSingleton(id, classInstance, dependencies);
	}

	public getScope(): Scope {
		return this.modules.getScope();
	}

	public dispose(): void {
		this.modules.dispose();
		this.modules = null;
	}

	public isStarted(): boolean {
		return this.started;
	}

	public getProperties(): MutableProperties {
		return this.getModules().getProperties();
	}

	private domReady(): void {
		this.logger.debug("DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root = new RootComponent(this.modules.getDefaultModule(), renderer);
		this.root.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
		this.started = true;
		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this, [this]);
		}

		this.logger.debug("Startup Complete");
	}

}

export default StageImpl;
