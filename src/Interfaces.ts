import { Digestable, Disposable, Gettable, Messagable, Tellable, Watchable } from "interface/Ables";
import { ElementMediator, MediatorSource, ModelMediator } from "interface/Mediator";
import { RegistryStrategy } from "interface/Strategy";
import { Logger } from "interface/Logger";
import { MutableProperties, Properties } from "interface/Property";
import { AttributeExtractor, NamedElementOperations } from "interface/Element";
import { OnContinuation, PubSub } from "interface/PubSub";

interface Type<T> extends Function {

	// tslint:disable-next-line
	new(...args: any[]): T;

}

interface MetadataContinuation {
	has: (name: string) => boolean;

	get: (name: string) => any;
}

interface Phase {

	process(items: any[]): any[];

	invalidate(): void;

	setCallback(callback: () => void): void;

}

interface Watcher<T> extends Supplier<T> {

	addCallback(context: any, callback: () => void): Watcher<T>;

}

interface Callback {
	context: any;
	fn: () => void;
}

interface EventHooks<T> {

	add(listener: (context: T) => void): void;

	notify(context: T): void;

}

interface Hooks {

	getDigestionCycleStartHooks(): EventHooks<Nestable>;

}

interface Mvvm extends MediatorSource {

	init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => Region): void;

	$dispose(): void;

	getId(): string;

	getNamedElement<E extends HTMLElement>(name: string): E;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	digest(): void;

	$apply(fn: Function, args: any[]): any;

	getModelFn(): () => any;

	getItemFn(): () => any;

	getScope(): Scope;

	skipId(id: string): void;

	getMessagables(): Messagable[];

	getModule(): Module;

	getModel(): any;

	createRegionName(): string;

	addRegion(name: string, element: HTMLElement, locked: boolean): Region;

	addNamedElement(name: string, element: HTMLElement): void;

	addMediator(mediator: any): void;

	addPropagatingElementMediator(mediator: any): void;

	getExtractor(): AttributeExtractor;

	isValidated(): boolean;

}

/**
 * Dependencies for {@link ElementMediator}
 */

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	message(channelName: string, messageName: string, payload: any): void;

	hasComponent(): boolean;

}

interface Supplier<T> {

	get(): T;

}

interface Scope {

	add(name: string, item: any): void;

	remove(name: string): void;

}

interface Factory<T> extends Disposable {
	get(gettable: Gettable): T;
}
interface ElementMediatorDependencies {
	/**
	 * Guts of a {@link Component}
	 */
	parent: ComponentInternals;

	/**
	 * The bound HTML element
	 */
	el: HTMLElement | Text;

	/**
	 * The bound expression of "truthiness"
	 */
	expression: string;

	/**
	 * The bound Cydran model of the {@link Component}
	 */
	model: any;

	/**
	 * Prefix of any Cydran attribute.
	 */
	prefix: string;

	/**
	 * Attribute prefix of the mediator.
	 */
	mediatorPrefix: string;

	/**
	 * Module instance.
	 */
	module: Module;

	/**
	 * Whether validation is active.
	 */
	validated: boolean;

	/**
	 * Whether the expression is mutable.
	 */
	mutable: boolean;
}

interface ElementMediatorInternals<M, E extends HTMLElement | Text, P>
	extends Disposable,
		Tellable {
	initialize(dependencies: ElementMediatorDependencies): void;

	validate(): void;

	populate(): void;

	mount(): void;

	unmount(): void;

	digest(): void;

	message(channelName: string, messageName: string, payload?: any): void;

	is(name: string): boolean;

	$dispose(): void;

	getId(): string;

	get<U>(id: string): U;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	bridge(name: string): void;

	getEl(): E;

	getParams(): P;

	getMediatorPrefix(): string;

	getExpression(): string;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	getModel(): any;

	getParent(): Nestable;

	getModelMediator(): ModelMediator<M>;

	$apply(fn: Function, args: any[]): any;
}

interface Module extends Register, Tellable {
	getName(): string;

	associate(...componentClasses: Type<Nestable>[]): Module;

	disassociate(...componentClasses: Type<Nestable>[]): Module;

	clear(): Module;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	message(channelName: string, messageName: string, payload?: any): void;

	getDefaultModule(): Module;

	getModule(name: string): Module;

	expose(id: string): Module;

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	getScope(): Scope;

	hasRegistration(id: string, moduleName?: string): boolean;

	addStrategy(strategy: RegistryStrategy): Module;

	getLogger(): Logger;

	createPubSubFor(context: any): PubSub;

	getProperties(): MutableProperties;
}
interface ModulesContext extends Disposable {
	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerPrototypeWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies: string[]
	): void;

	registerSingleton(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerSingletonWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies: string[]
	): void;

	registerElementMediator(
		name: string,
		supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>
	): void;

	getScope(): Scope;

	get<T>(id: string): T;

	getProperties(): MutableProperties;
}

interface ComponentFactory {
	create(item?: any): Nestable;
}

interface ComponentIdPair {

	componentId: string;

	moduleId: string;

}

interface ComponentOptions {
	metadata?: SimpleMap<any>;

	prefix?: string;
}

interface InternalComponentOptions extends ComponentOptions {
	repeatable?: boolean;

	itemFn?: () => any;

	parentModelFn?: () => any;

	module?: Module;

	alwaysConnected?: boolean;

	parent?: Nestable;

	skipId?: string;
}

interface Nestable extends Disposable, Watchable, Messagable, Tellable {
	metadata(): MetadataContinuation;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(
		name: string,
		componentName: string,
		defaultComponentName?: string
	): void;

	getParent(): Nestable;

	getEl(): HTMLElement;

	get<T>(id: string): T;

	scope(): Scope;

	getPrefix(): string;

	isMounted(): boolean;

	isConnected(): boolean;

	getId(): string;

	getProperties(): Properties;
}

interface ComponentInternals extends Digestable, Mvvm {
	init(): void;

	hasMetadata(name: string): boolean;

	getMetadata(name: string): any;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(
		name: string,
		componentId: string,
		defaultComponentName?: string
	): void;

	message(channelName: string, messageName: string, payload: any): void;

	tell(name: string, payload: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	$dispose(): void;

	getEl(): HTMLElement;

	getComponent(): Nestable;

	get<T>(id: string): T;

	getPrefix(): string;

	isMounted(): boolean;

	isConnected(): boolean;

	isRepeatable(): boolean;

	getScope(): Scope;

	watch<T>(
		expression: string,
		target: (previous: T, current: T) => void,
		reducerFn?: (input: any) => T,
		context?: any
	): void;

	on(target: (payload: any) => void, messageName: string, channel?: string): void;

	forElement<E extends HTMLElement>(name: string): NamedElementOperations<E>;

	getLogger(): Logger;

	getModule(): Module;

	getParent(): Nestable;

	evaluate<T>(expression: string): T;

	setItemFn(itemFn: () => any): void;

	getData(): any;

	getId(): string;

	getWatchContext(): any;
}

interface SimpleMap<T> {
	[key: string]: T;
}

interface Registry extends Register, Gettable {
	addStrategy(strategy: RegistryStrategy): void;
}

interface Register extends Disposable {
	registerConstant(id: string, instance: any): any | void;

	registerPrototype(
		id: string,
		classInstance: Type<any>,
		dependencies?: string[]
	): any | void;

	registerPrototypeWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies?: string[]
	): any | void;

	registerSingleton(
		id: string,
		classInstance: Type<any>,
		dependencies?: string[]
	): any | void;

	registerSingletonWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies?: string[]
	): any | void;

	hasRegistration(id: string): boolean;
}

export {
	SimpleMap,
	Register,
	Registry,
	Callback,
	EventHooks,
	Factory,
	Hooks,
	MetadataContinuation,
	Mvvm,
	NamedElementOperations,
	OnContinuation,
	Phase,
	PubSub,
	Region,
	Scope,
	Supplier,
	Type,
	Watcher,
	ElementMediator,
	ElementMediatorDependencies,
	ElementMediatorInternals,
	Module,
	ModulesContext,
	ComponentInternals,
	ComponentFactory,
	ComponentIdPair,
	ComponentOptions,
	InternalComponentOptions,
	Nestable
};