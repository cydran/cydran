import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Stage from "stage/Stage";
import ComponentIdPair from "component/CompnentIdPair";
import Component from "component/Component";
import Renderer from "component/Renderer";
import StageRendererImpl from "component/renderer/StageRendererImpl";
import Module from "module/Module";
import ModulesContext from "module/ModulesContext";
import ModulesContextImpl from "module/ModulesContextImpl";
import Nestable from "interface/ables/Nestable";
import Events from "const/EventsFields";
import Type from "interface/Type";
import Scope from "scope/Scope";
import Ids from "const/IdsFields";
import PropertyKeys from "const/PropertyKeys";
import { MutableProperties } from "properties/Property";
import { extractClassName, isDefined, requireNotNull, requireValid } from "util/Utils";
import { DEFAULT_MODULE_KEY, CYDRAN_PUBLIC_CHANNEL, VALID_ID } from "const/HardValues";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import StageComponent from "stage/StageComponent";
import ComponentTransitions from "component/ComponentTransitions";
import InternalDom from "dom/InternalDom";
import Dom from "dom/Dom";
import DomImpl from "dom/DomImpl";
import CydranContextImpl from "context/CydranContextImpl";
import CydranContext from "context/CydranContext";
import FactoriesImpl from '../factory/FactoriesImpl';
import CydranMode from "const/CydranMode";
import SimpleMap from "interface/SimpleMap";
import behaviorsPreinitializer from "behavior/core/behaviorsPreinitializer";
import Behavior from "behavior/Behavior";

const CYDRAN_STYLES: string = `
/*
 * Cydran CSS Styles
 */
`;

class StageImpl implements Stage {

	private started: boolean;

	private rootSelector: string;

	private logger: Logger;

	private preinitializers: ((stage?: Stage) => void)[];

	private initializers: ((stage?: Stage) => void)[];

	private disposers: ((stage?: Stage) => void)[];

	private root: Component;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private modules: ModulesContextImpl;

	private dom: InternalDom;

	private cydranContext: CydranContext;

	constructor(rootSelector: string, properties: SimpleMap<any> = {}) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.dom = new DomImpl(properties[PropertyKeys.CYDRAN_OVERRIDE_WINDOW]);
		this.cydranContext = new CydranContextImpl(this.dom, properties);
		this.modules = new ModulesContextImpl(this.cydranContext);
		this.getProperties().load(properties);
		this.getLoggerFactory().setPreferences(this.getProperties());
		this.logger = this.getLoggerFactory().getLogger(`Stage`);
		this.started = false;
		this.preinitializers = [];
		this.initializers = [];
		this.disposers = [];
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.root = null;
		this.withPreinitializer(behaviorsPreinitializer);
		this.withDisposer((stage: Stage) => {
			stage.broadcast(CYDRAN_PUBLIC_CHANNEL, Events.CYDRAN_PREAPP_DISPOSAL);
			this.logger = null;
		});

	}

	public getLoggerFactory(): LoggerFactory {
		return this.cydranContext.logFactory();
	}

	public withPreinitializer(callback: (stage?: Stage) => void): Stage {
		requireNotNull(callback, "callback");
		this.preinitializers.push(callback);
		return this;
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
		const wkModuleName: string = this.workingModuleName(moduleName);
		this.topComponentIds.push({componentId: id, moduleId: wkModuleName});
		this.logger.ifDebug(() => `With component before: ${wkModuleName}.${id}`);
	}

	public withComponentAfter(id: string, moduleName?: string): void {
		requireValid(id, "id", VALID_ID);
		const wkModuleName: string = this.workingModuleName(moduleName);
		this.bottomComponentIds.push({componentId: id, moduleId: wkModuleName});
		this.logger.ifDebug(() => `With component after: ${wkModuleName}.${id}`);
	}

	public start(): Stage {
		(this.cydranContext.getFactories() as FactoriesImpl).importFactories(this.getProperties());

		this.logger.ifInfo(() => "Start Requested");

		if (this.started) {
			this.logger.ifInfo(() => "Aleady Started");
			return this;
		}

		this.logger.ifInfo(() => "Cydran Starting");
		this.modules.registerConstantUnguarded(Ids.STAGE, this);

		this.logger.ifDebug(() => "Running preinitializers");

		for (const preinitializer of this.preinitializers) {
			preinitializer.apply(this, [this]);
		}

		this.publishMode();

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STARTUP_SYNCHRONOUS)) {
			this.domReady();
		} else {
			this.dom.onReady(this.domReady, this);
		}

		return this;
	}

	public setComponent(component: Nestable): Stage {
		if (isDefined(component)) {
			this.logger.ifTrace(() => `Set component: ${extractClassName(component)}`);
		}

		this.root.setChild("body", component);

		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.logger.ifInfo(() => `Set component from registry: ${ componentName }`);
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

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.modules.registerBehavior(name, supportedTags, behaviorClass);
	}

	public registerBehaviorFunction(name: string, supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.modules.registerBehaviorFunction(name, supportedTags, behavionFunction);
	}

	public getScope(): Scope {
		return this.modules.getScope();
	}

	public $dispose(): void {
		this.root.tell(ComponentTransitions.UNMOUNT);
		this.modules.$dispose();
		this.modules = null;
	}

	public isStarted(): boolean {
		return this.started;
	}

	public getProperties(): MutableProperties {
		return this.getModules().getProperties();
	}

	public getDom(): Dom {
		return this.dom;
	}

	private workingModuleName(moduleName: string): string {
		const retval = moduleName || DEFAULT_MODULE_KEY;
		return retval;
	}

	private domReady(): void {
		this.completeStartup();
	}

	private publishMode(): void {
		const isStrict: boolean = this.getProperties().isTruthy(PropertyKeys.CYDRAN_STRICT_ENABLED);

		const modeLabel: string = isStrict ? CydranMode.STRICT : CydranMode.LAZY;
		let extra: string = "";
		if(isStrict) {
			extra = `${ this.getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_STARTPHRASE) } - ${ this.getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_MESSAGE) }`;
		} else {
			extra = this.getProperties().getAsString(PropertyKeys.CYDRAN_LAZY_STARTPHRASE);
		}

		this.logger.ifInfo(() => `MODE: ${ modeLabel.toUpperCase() } - ${ extra }`);
	}

	private completeStartup(): void {
		this.logger.ifInfo(() => "DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.dom, this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root = new StageComponent(renderer, this.modules.getDefaultModule());
		this.root.tell("setParent", null);
		this.root.tell(ComponentTransitions.MOUNT);
		this.started = true;

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STYLES_ENABLED)) {
			this.addStyles();
		}

		this.logger.ifDebug(() => "Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this, [this]);
		}

		this.logger.ifInfo(() => "Adding event listeners");
		this.dom.getWindow().addEventListener("beforeunload", () => {
			for (const disposer of this.disposers) {
				disposer.apply(this, [this]);
			}
			this.$dispose();
		});

		this.logger.ifInfo(() => "Startup Complete");
	}

	private addStyles(): void {
		const head: HTMLHeadElement = this.getDom().getDocument().head;

		let styleElementMissing: boolean = true;

		// tslint:disable-next-line
		for (let i = 0; i < head.children.length; i++) {
			const child: HTMLElement = head.children[i] as HTMLElement;

			if (child.tagName.toLowerCase() === "style" && child.id === "cydran-styles") {
				styleElementMissing = false;
				break;
			}
		}

		if (styleElementMissing) {
			const styleElement: HTMLStyleElement = this.dom.createElement("style");
			styleElement.id = "cydran-styles";
			styleElement.textContent = CYDRAN_STYLES;
			head.insertAdjacentElement("afterbegin", styleElement);
		}
	}

}

export default StageImpl;
