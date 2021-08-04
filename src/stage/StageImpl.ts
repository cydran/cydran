import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import { Stage } from "stage/Stage";
import ComponentIdPair from "component/CompnentIdPair";
import Component from "component/Component";
import Renderer from "element/Renderer";
import StageRendererImpl from "element/render/StageRendererImpl";
import Module from "module/Module";
import ModulesContext from "module/ModulesContext";
import ModulesContextImpl from "module/ModulesContextImpl";
import Nestable from "interface/ables/Nestable";
import Events from "const/EventsFields";
import Type from "interface/Type";
import Scope from "scope/Scope";
import Ids from "const/IdsFields";
import PropertyKeys from "const/PropertyKeys";
import { MutableProperties } from "interface/Property";
import { requireNotNull, requireValid, domReady, getWindow } from "util/Utils";
import { DEFAULT_MODULE_KEY, CYDRAN_PUBLIC_CHANNEL, VALID_ID } from "Constants";
import ArgumentsResolvers from "stage/ArgumentsResolvers";
import StageComponent from "stage/StageComponent";
import ComponentTransition from "component/ComponentTransition";

class StageImpl implements Stage {
	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private initializers: ((stage?: Stage) => void)[];

	private disposers: ((stage?: Stage) => void)[];

	private root: Component;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private modules: ModulesContextImpl;

	constructor(rootSelector: string) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.logger = LoggerFactory.getLogger("Stage");
		this.modules = new ModulesContextImpl();
		this.started = false;
		this.initializers = [];
		this.disposers = [];
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.root = null;
		this.withDisposer((stage: Stage) => {
			stage.broadcast(CYDRAN_PUBLIC_CHANNEL, Events.CYDRAN_PREAPP_DISPOSAL);
		});
	}

	public withInitializer(callback: (stage?: Stage) => void): Stage {
		requireNotNull(callback, "callback");
		this.initializers.push(callback);
		return this;
	}

	public withDisposer(callback: (stage?: Stage) => void): Stage {
		requireNotNull(callback, "callback");
		this.disposers.push(callback);
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
		this.modules.registerConstantUnguarded(Ids.STAGE, this);

		this.publishMode();
		domReady(this.domReady, this);

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
		requireNotNull(id, "id");
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

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.modules.registerPrototype(id, classInstance, resolvers);
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.modules.registerSingleton(id, classInstance, resolvers);
	}

	public getScope(): Scope {
		return this.modules.getScope();
	}

	public $dispose(): void {
		this.root.tell(ComponentTransition.UNMOUNT);
		this.root.$dispose();
		this.modules.$dispose();
		this.modules = null;
	}

	public isStarted(): boolean {
		return this.started;
	}

	public getProperties(): MutableProperties {
		return this.getModules().getProperties();
	}

	private domReady(): void {
		this.completeStartup();
	}

	private publishMode(): void {
		const mode: string = this.getProperties().isTruthy(PropertyKeys.CYDRAN_PRODUCTION_ENABLED) ? "PRODUCTION" : "DEVELOPMENT";
		const extra: string = (mode === "PRODUCTION") ? "" : "incurring substantial overhead for additional validation, constraint checks, and logging";
		const startMsg: string = `Cydran ${mode} mode active ${extra}`;
		this.logger.warn(startMsg);
	}

	private completeStartup(): void {
		this.logger.debug("DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.rootSelector, null, this.topComponentIds, this.bottomComponentIds);
		this.root = new StageComponent(renderer, this.modules.getDefaultModule());
		this.root.tell("setParent", null);
		this.root.tell(ComponentTransition.MOUNT);
		this.started = true;
		this.logger.debug("Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this, [this]);
		}

		getWindow().addEventListener("beforeunload", () => {
			for (const disposer of this.disposers) {
				disposer.apply(this, [this]);
			}

			this.$dispose();
			this.logger.debug("Disposers complete");
		});

		this.logger.debug("Startup Complete");
	}
}

export default StageImpl;
