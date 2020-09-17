interface ComponentIdPair {

	componentId: string;

	moduleId: string;

}

interface Renderer {

	render(): HTMLElement;

}

interface Nestable extends Disposable, Watchable, Messagable {

	metadata(): MetadataContinuation;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentName: string, defaultComponentName?: string): void;

	getParent(): Nestable;

	getEl(): HTMLElement;

	get<T>(id: string): T;

	scope(): Scope;

	getPrefix(): string;

	isConnected(): boolean;

	getId(): string;

	getProperties(): Properties;

}

interface Type<T> extends Function {

	// tslint:disable-next-line
	new(...args: any[]): T;

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

interface MetadataContinuation {

	has: (name: string) => boolean;

	get: (name: string) => any;

}

interface StageBuilder {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): StageBuilder;

	withComponentBefore(id: string, moduleName?: string): StageBuilder;

	withComponentAfter(id: string, moduleName?: string): StageBuilder;

	withComponent(id: string): StageBuilder;

	withInitializer(callback: (stage?: Stage) => void): StageBuilder;

	withTraceLogging(): StageBuilder;

	withDebugLogging(): StageBuilder;

	withInfoLogging(): StageBuilder;

	withWarnLogging(): StageBuilder;

	withErrorLogging(): StageBuilder;

	withFatalLogging(): StageBuilder;

	withLoggingDisabled(): StageBuilder;

	withElementMediator(name: string, supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): StageBuilder;

	withConstant(id: string, instance: any): StageBuilder;

	withPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder;

	withPrototypeFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder;

	withSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder;

	withSingletonFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder;

	withImplicit(id: string, template: string, options?: ComponentOptions): StageBuilder;

	withCapability(capability: (builder: StageBuilder) => void): StageBuilder;

	withScopeItem(name: string, item: any): StageBuilder;

	withProperties(properties: any): StageBuilder;

	build(): Stage;

}

interface Stage extends Disposable {

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	get<T>(id: string): T;

	start(): Stage;

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>): void;

	registerSingleton(id: string, classInstance: Type<any>): void;

	getScope(): Scope;

	isStarted(): boolean;

}

interface Properties {

	get<T>(key: string): T;

	extend(): MutableProperties;

	isDefined(key: string): boolean;

	isTruthy(key: string): boolean;

	getAsString(key: string): string;

}

interface MutableProperties extends Properties {

	set(key: string, value: any): MutableProperties;

	load(values: any): MutableProperties;

	remove(key: string): MutableProperties;

	clear(): MutableProperties;

}

interface Filter {

	items(): any[];

	extend(): FilterBuilder;

}

interface LimitOffsetFilter extends Filter {

	getLimit(): number;

	setLimit(limit: number): void;

	getOffset(): number;

	setOffset(offset: number): void;

	setLimitAndOffset(limit: number, offset: number): void;

}

interface PagedFilter extends Filter {

	getPageSize(): number;

	setPageSize(size: number): void;

	getTotalPages(): number;

	getPage(): number;

	setPage(page: number): void;

	toPrevious(): void;

	toNext(): void;

	toStart(): void;

	toEnd(): void;

	isAtBeginning(): boolean;

	isAtEnd(): boolean;

	isMoreBefore(): boolean;

	isMoreAfter(): boolean;

}

interface FilterBuilder {

	withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withPhase(fn: (input: any[]) => any[]): FilterBuilder;

	withSimplePredicate(predicate: (index: number, value: any) => boolean): FilterBuilder;

	withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withLimit(limit: number): FilterBuilder;

	with(fn: (builder: FilterBuilder) => void): FilterBuilder;

	build(): Filter;

	paged(): PagedFilter;

	limited(): LimitOffsetFilter;

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

interface ModulesContext extends Disposable {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void;

	registerSingleton(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void;

	registerElementMediator(name: string, supportedTags: string[], elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): void;

	getScope(): Scope;

	get<T>(id: string): T;

	getProperties(): MutableProperties;

}

interface Module extends Register {

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

interface Register {

	registerConstant(id: string, instance: any): any | void;

	registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): any | void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void;

	registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): any | void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void;

}

interface Mvvm extends MediatorSource {

	init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => Region): void;

	nestingChanged(): void;

	$dispose(): void;

	getId(): string;

	getNamedElement<E extends HTMLElement>(name: string): E;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	digest(): void;

	$apply(fn: Function, args: any[]): any;

	getModelFn(): () => any;

	getItemFn(): () => any;

	getScope(): Scope;

	getParent(): ComponentInternals;

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
interface ElementMediatorDependencies {

	/**
	 * The {@link Mvvm} connected to the {@link ElementMediator}
	 */
	mvvm: Mvvm;

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

interface ComponentFactory {

	create(item?: any): Nestable;

}

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	message(channelName: string, messageName: string, payload: any): void;

	hasComponent(): boolean;

}



interface ElementMediator<M, E extends HTMLElement | Text, P> extends Disposable, MediatorSource {

	populate(): void;

	/**
	 * Initialize this element mediator.
	 */
	init(): void;

	/**
	 * Get the active module instance reference by id
	 * @return U
	 */
	get<U>(id: string): U;

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	message(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Broadcast a message
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	broadcast(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Broadcast a message in the Global context
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	getParentId(): string;

	hasPropagation(): boolean;

	isTopLevelSupported(): boolean;

	isChildrenConsumable(): boolean;

}

interface ComponentInternals extends Digestable {

	init(): void;

	hasMetadata(name: string): boolean;

	getMetadata(name: string): any;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void;

	message(channelName: string, messageName: string, payload: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	$dispose(): void;

	getEl(): HTMLElement;

	getComponent(): Nestable;

	get<T>(id: string): T;

	getPrefix(): string;

	isConnected(): boolean;

	isRepeatable(): boolean;

	getScope(): Scope;

	watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void;

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

interface NamedElementOperations<E extends HTMLElement> {

	get(): E;

	focus(): void;

	blur(): void;

}

interface DomWalker<C> {

	walk(root: HTMLElement, context: C): void;

}

interface ElementVisitor<E extends HTMLElement | Text | Comment, C> {

	visit(element: E, context: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void;

}

interface Disposable {

	$dispose(): void;

}

interface Supplier<T> {

	get(): T;

}

interface SimpleMap<T> {

	[key: string]: T;

}

interface Broker extends Disposable {

	broadcast(channelName: string, messageName: string, payload?: any): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;

}

interface OnContinuation {

	invoke(target: (payload: any) => void): void;

	forChannel(name: string): ForChannelContinuation;

}

interface ForChannelContinuation {

	invoke(target: (payload: any) => void): void;

}

interface Listener extends Disposable {

	register(messageName: string, fn: (payload: any) => void): void;

	receive(messageName: string, payload: any): void;

	getChannelName(): string;

}

interface Messagable {

	message(channelName: string, messageName: string, payload?: any): void;

}

interface PubSub extends Disposable {

	message(channelName: string, messageName: string, payload?: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	enableGlobal(): void;

	disableGlobal(): void;

	isGlobalEnabled(): boolean;

}

interface AttributeExtractor {

	extract(element: HTMLElement, name: string): string;

	remove(element: HTMLElement, name: string): void;

	isEventAttribute(name: string): boolean;

	isMediatorAttribute(name: string): boolean;

	extractEventName(name: string): string;

	extractMediatorName(name: string): string;

	asTypePrefix(name: string): string;

	getPrefix(): string;

}

interface Digestable {

	$apply(fn: Function, args: any[]): void;

}

interface Digester {

	skipId(id: string): void;

	digest(): void;

}

interface DigestionCandidate extends Evaluatable, Notifyable {

	getExpression(): string;

}

interface DigestionCandidateConsumer {

	add(key: string, mediators: DigestionCandidate[]): void;

}

interface DigestionContext extends DigestionCandidateConsumer {

	digest(): Notifyable[];

}

interface ElementStrategy {

	consume(): void;

}

interface Evaluatable {

	evaluate(): boolean;

}

interface MediatorSource {

	requestMediators(consumer: DigestionCandidateConsumer): void;

	requestMediatorSources(sources: MediatorSource[]): void;

	getId(): string;

}

interface Notifyable {

	notify(): void;

}

interface ModelMediator<T> extends Disposable, DigestionCandidate {

	invoke(params?: any): void;

	get(): T;

	set(value: any): void;

	watch(context: any, target: (previous: T, current: T) => void): void;

}

interface Watchable {

	watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void;

	evaluate<T>(expression: string): T;

	getWatchContext(): any;

}

interface Scope {

	add(name: string, item: any): void;

	remove(name: string): void;

}

interface OutputStrategy {
	/**
	 * Log the message
	 * @param logname name of the log
	 * @param level {Level} of message
	 * @param payload message/object to be logged
	 * @param error optional object or boolean to indicate +/- on whether or not to log the stack/message
	 */
	log(logname: string, level: Level, payload: any, errorStack?: Error | boolean): void;

}

interface LoggerService {

	log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void;

	isTrace(): boolean;

	isDebug(): boolean;

	isInfo(): boolean;

	isWarn(): boolean;

	isError(): boolean;

	isFatal(): boolean;

	isDisabled(): boolean;

}

interface Logger {

	getName(): string;

	trace(payload: any, error?: Error): void;

	ifTrace(payloadFn: () => any, error?: Error): void;

	debug(payload: any, error?: Error): void;

	ifDebug(payloadFn: () => any, error?: Error): void;

	info(payload: any, error?: Error): void;

	ifInfo(payloadFn: () => any, error?: Error): void;

	warn(payload: any, error?: Error): void;

	ifWarn(payloadFn: () => any, error?: Error): void;

	error(payload: any, error?: Error): void;

	ifError(payloadFn: () => any, error?: Error): void;

	fatal(payload: any, error?: Error): void;

	ifFatal(payloadFn: () => any, error?: Error): void;

	isTrace(): boolean;

	isDebug(): boolean;

	isInfo(): boolean;

	isWarn(): boolean;

	isError(): boolean;

	isFatal(): boolean;

	isDisabled(): boolean;

}

enum Level {
	TRACE,
	DEBUG,
	INFO,
	WARN,
	ERROR,
	FATAL,
	DISABLED
}

interface Validator {

	getFunction(): (name: string, value?: any) => Validators;

	throwIfErrors(prefixFn: () => string): void;

}

interface Validators {

	matches(regex: RegExp): Validators;

	isDefined(): Validators;

	oneOf(...options: any[]): Validators;

	requireIfDefined(name: string, requiredValue: any): Validators;

	requireIfEquals(expected: any, name: string, requiredValue: any): Validators;

	requireIfTrue(test: boolean): Validators;

	disallowIfTrue(test: boolean, message: string): Validators;

	notEmpty(): Validators;

	reject(message: string): Validators;

}

interface RegistryStrategy {

	get<T>(id: string, gettable: Gettable): T;

}

interface Gettable {

	get<T>(id: string): T;

}

interface IdStrategy {

	check(item: any): boolean;

	enrich(item: any, index: number): void;

	extract(item: any): string;

	init(): void;

}

interface ElementReference<E extends HTMLElement> {

	set(element: E): void;

	get(): E;

}

interface Factory<T> {

	get(gettable: Gettable): T;

}

interface Registry extends Register, Gettable {

	addStrategy(strategy: RegistryStrategy): void;

}

export {
	Registry,
	Factory,
	ElementReference,
	IdStrategy,
	Gettable,
	RegistryStrategy,
	Validators,
	Validator,
	Level,
	Logger,
	LoggerService,
	OutputStrategy,
	Scope,
	Watchable,
	ModelMediator,
	Notifyable,
	MediatorSource,
	Evaluatable,
	ElementStrategy,
	DigestionContext,
	DigestionCandidateConsumer,
	DigestionCandidate,
	Digester,
	Digestable,
	AttributeExtractor,
	PubSub,
	Messagable,
	Listener,
	OnContinuation,
	ForChannelContinuation,
	Broker,
	Callback,
	ComponentFactory,
	ComponentIdPair,
	ComponentInternals,
	ComponentOptions,
	Disposable,
	DomWalker,
	ElementMediator,
	ElementMediatorDependencies,
	ElementVisitor,
	EventHooks,
	Filter,
	FilterBuilder,
	Hooks,
	InternalComponentOptions,
	LimitOffsetFilter,
	MetadataContinuation,
	Module,
	ModulesContext,
	MutableProperties,
	Mvvm,
	NamedElementOperations,
	Nestable,
	PagedFilter,
	Phase,
	Properties,
	Region,
	Register,
	Renderer,
	SimpleMap,
	Stage,
	StageBuilder,
	Supplier,
	Type,
	Watcher
};