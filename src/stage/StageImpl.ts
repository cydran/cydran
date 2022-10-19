import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Stage from "stage/Stage";
import ComponentIdPair from "component/CompnentIdPair";
import Component from "component/Component";
import Renderer from "component/Renderer";
import StageRendererImpl from "component/renderer/StageRendererImpl";
import Context from "context/Context";
import Events from "const/EventsFields";
import Type from "interface/Type";
import Scope from "scope/Scope";
import Ids from "const/IdsFields";
import PropertyKeys from "const/PropertyKeys";
import { MutableProperties } from "properties/Property";
import { extractClassName, isDefined, requireNotNull, requireValid } from "util/Utils";
import { DEFAULT_CONTEXT_KEY, CYDRAN_PUBLIC_CHANNEL, VALID_ID } from "const/HardValues";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import StageComponent from "stage/StageComponent";
import ComponentTransitions from "component/ComponentTransitions";
import Dom from "dom/Dom";
import Services from "service/Services";
import FactoriesImpl from '../factory/FactoriesImpl';
import CydranMode from "const/CydranMode";
import SimpleMap from "interface/SimpleMap";
import behaviorsPreinitializer from "behavior/core/behaviorsPreinitializer";
import Behavior from "behavior/Behavior";
import { Nestable } from "interface/ComponentInterfaces";
import PubSub from "message/PubSub";
import RegistryStrategy from "registry/RegistryStrategy";
import DomImpl from "dom/DomImpl";
import RootContextImpl from "context/RootContextImpl";
import InternalContext from "context/InternalContext";

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

	private context: InternalContext;

	constructor(rootSelector: string, properties: SimpleMap<any> = {}) {
		this.rootSelector = requireNotNull(rootSelector, "rootSelector");
		this.context = new RootContextImpl(properties);
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

	public removeChild(name: string): void {
		this.context.removeChild(name);
	}

	public getObject<T>(id: string): T {
		return this.context.getObject(id);
	}

	public getLoggerFactory(): LoggerFactory {
		return this.context.getServices().logFactory();
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

	public withComponentBefore(id: string, contextName?: string): void {
		requireValid(id, "id", VALID_ID);
		const wkContextName: string = this.workingContextName(contextName);
		this.topComponentIds.push({componentId: id, contextId: wkContextName});
		this.logger.ifDebug(() => `With component before: ${wkContextName}.${id}`);
	}

	public withComponentAfter(id: string, contextName?: string): void {
		requireValid(id, "id", VALID_ID);
		const wkContextName: string = this.workingContextName(contextName);
		this.bottomComponentIds.push({componentId: id, contextId: wkContextName});
		this.logger.ifDebug(() => `With component after: ${wkContextName}.${id}`);
	}

	public start(): Stage {
		(this.context.getServices().getFactories() as FactoriesImpl).importFactories(this.getProperties());

		this.logger.ifInfo(() => "Start Requested");

		if (this.started) {
			this.logger.ifInfo(() => "Aleady Started");
			return this;
		}

		this.logger.ifInfo(() => "Cydran Starting");
		this.context.registerConstantUnguarded(Ids.STAGE, this);
		this.logger.ifDebug(() => "Running preinitializers");

		for (const preinitializer of this.preinitializers) {
			preinitializer.apply(this, [this]);
		}

		this.publishMode();

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STARTUP_SYNCHRONOUS)) {
			this.domReady();
		} else {
			(this.context.getServices().getDom() as DomImpl).onReady(this.domReady, this);
		}

		return this;
	}

	public setComponent(component: Nestable): Stage {
		if (isDefined(component)) {
			this.logger.ifTrace(() => `Set component: ${extractClassName(component)}`);
		}

		this.root.$c().regions().set("body", component);

		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		requireNotNull(componentName, "componentName");
		this.logger.ifInfo(() => `Set component from registry: ${ componentName }`);
		this.root.$c().regions().setFromRegistry("body", componentName, defaultComponentName);
		return this;
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");
		return this.root.$c().getObject(id);
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.context.broadcast(channelName, messageName, payload);
	}

	public registerConstant(id: string, instance: any): void {
		this.context.registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.context.registerPrototype(id, classInstance, resolvers);
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.context.registerSingleton(id, classInstance, resolvers);
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.context.registerBehavior(name, supportedTags, behaviorClass);
	}

	public registerBehaviorFunction(name: string, supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.context.registerBehaviorFunction(name, supportedTags, behavionFunction);
	}

	public getScope(): Scope {
		return this.context.getScope();
	}

	public $dispose(): void {
		this.root.$c().tell(ComponentTransitions.UNMOUNT);
		this.context.$dispose();
		this.context = null;
	}

	public isStarted(): boolean {
		return this.started;
	}

	public getProperties(): MutableProperties {
		return this.context.getProperties();
	}

	public getDom(): Dom {
		return this.context.getServices().getDom();
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------

	public getName(): string {
		return this.context.getName();
	}

	public clear(): Context {
		throw new Error("Method not implemented.");
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public expose(id: string): Context {
		throw new Error("Method not implemented.");
	}

	public getChild(name: string): Context {
		throw new Error("Method not implemented.");
	}

	public getRoot(): Context {
		throw new Error("Method not implemented.");
	}

	public isRoot(): boolean {
		throw new Error("Method not implemented.");
	}

	public getParent(): Context {
		throw new Error("Method not implemented.");
	}

	public hasChild(name: string): boolean {
		throw new Error("Method not implemented.");
	}

	public addchild(name: string, initializer?: (context: Context) => void): Context {
		throw new Error("Method not implemented.");
	}

	public getLocalObject<T>(id: string): T {
		throw new Error("Method not implemented.");
	}

	public hasRegistration(id: string): boolean {
		throw new Error("Method not implemented.");
	}

	public addStrategy(strategy: RegistryStrategy): Context {
		throw new Error("Method not implemented.");
	}

	public getLogger(): Logger {
		throw new Error("Method not implemented.");
	}

	public createPubSubFor(targetThis: any): PubSub {
		throw new Error("Method not implemented.");
	}

	public getServices(): Services {
		throw new Error("Method not implemented.");
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers) {
		throw new Error("Method not implemented.");
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers) {
		throw new Error("Method not implemented.");
	}

	public tell(name: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}



	// ----------------------------------------------------------------------------------------------------------------------------------------------

	private workingContextName(contextName: string): string {
		const retval = contextName || DEFAULT_CONTEXT_KEY;
		return retval;
	}

	private domReady(): void {
		this.completeStartup();
	}

	private publishMode(): void {
		const isStrict: boolean = this.getProperties().isTruthy(PropertyKeys.CYDRAN_STRICT_ENABLED);

		const modeLabel: string = isStrict ? CydranMode.STRICT : CydranMode.LAZY;
		let extra: string = "";

		if (isStrict) {
			extra = `${ this.getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_STARTPHRASE) } - ${ this.getProperties().getAsString(PropertyKeys.CYDRAN_STRICT_MESSAGE) }`;
		} else {
			extra = this.getProperties().getAsString(PropertyKeys.CYDRAN_LAZY_STARTPHRASE);
		}

		this.logger.ifInfo(() => `MODE: ${ modeLabel.toUpperCase() } - ${ extra }`);
	}

	private completeStartup(): void {
		this.logger.ifInfo(() => "DOM Ready");
		const renderer: Renderer = new StageRendererImpl(this.getDom(), this.rootSelector, this.topComponentIds, this.bottomComponentIds);
		this.root = new StageComponent(renderer, this.context);
		this.root.$c().tell("setParent", null);
		this.root.$c().tell(ComponentTransitions.MOUNT);
		this.started = true;

		if (this.getProperties().isTruthy(PropertyKeys.CYDRAN_STYLES_ENABLED)) {
			this.addStyles();
		}

		this.logger.ifDebug(() => "Running initializers");

		for (const initializer of this.initializers) {
			initializer.apply(this, [this]);
		}

		this.logger.ifInfo(() => "Adding event listeners");
		this.getDom().getWindow().addEventListener("beforeunload", () => {
			for (const disposer of this.disposers) {
				disposer.apply(this, [this]);
			}
			this.$dispose();
		});

		this.logger.ifInfo(() => "Startup Complete");
	}

	// TODO - Move style handling into dedicated and separately testable class

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
			const styleElement: HTMLStyleElement = this.getDom().createElement("style");
			styleElement.id = "cydran-styles";
			styleElement.textContent = CYDRAN_STYLES;
			head.insertAdjacentElement("afterbegin", styleElement);
		}
	}

}

export default StageImpl;
