import SimpleMap from "interface/SimpleMap";
import Logger from "log/Logger";
import { requireNotNull, requireValid, defaultAsNull, isDefined, forEachField } from 'util/Utils';
import { NamingConflictError, UnknownContextError } from "error/Errors";
import Initializers from "context/Initializers";
import InitializersImpl from "context/InitializersImpl";
import AbstractContextImpl from 'context/AbstractContextImpl';
import { Context, InternalContext, Registry } from 'context/Context';
import { Ids, OBJECT_ID, CONTEXT_NAME, To } from 'CydranConstants';
import { MutableProperties } from "properties/Property";
import Scope from "scope/Scope";
import StageInternalsImpl from "stage/StageInternalsImpl";
import argumentsBuilder from "function/argumentsBuilder";
import GlobalContextHolder from 'context/GlobalContextHolder';
import StageComponent from 'stage/StageComponent';
import getLogger from "log/getLogger";

abstract class AbstractNamedContextImpl<C extends Context> extends AbstractContextImpl<Context> implements Context {

	private children: SimpleMap<Context>;

	private logger: Logger;

	private preInitializers: Initializers<C>;

	private initializers: Initializers<C>;

	private disposers: Initializers<C>;

	constructor(name: string, parent?: Context) {
		super(name, parent);
		this.children = {};
		this.preInitializers = new InitializersImpl<C>();
		this.initializers = new InitializersImpl<C>();
		this.disposers = new InitializersImpl<C>();
		this.init();
	}

	public expose(id: string): Context {
		requireValid(id, "id", OBJECT_ID);

		throw new Error("Method not supported until issue #651 is implemented.");
	}

	public addPreInitializer(thisObject: Object, callback: (context?: Context) => void): void {
		this.preInitializers.add(thisObject, callback);
	}

	public addInitializer(thisObject: Object, callback: (context?: Context) => void): void {
		this.initializers.add(thisObject, callback);
	}

	public addDisposer(thisObject: Object, callback: (context?: Context) => void): void {
		this.disposers.add(thisObject, callback);
	}

	public getChild(name: string): Context {
		requireValid(name, "name", CONTEXT_NAME);

		return defaultAsNull(this.children[name]);
	}

	public hasChild(name: string): boolean {
		requireValid(name, "name", CONTEXT_NAME);

		return isDefined(this.children[name]);
	}

	public addChild(name: string, initializer?: (context: Context) => void): Context {
		requireValid(name, "name", CONTEXT_NAME);

		if (isDefined(this.children[name])) {
			throw new NamingConflictError("Child context name already exists: " + name);
		}

		const child: Context = new ChildContextImpl(name, this);

		this.children[name] = child;

		if (isDefined(initializer)) {
			initializer(child);
		}

		return child;
	}

	public removeChild(name: string): Context {
		requireValid(name, "name", CONTEXT_NAME);

		if (!this.hasChild(name)) {
			throw new UnknownContextError("Unknown child context: " + name);
		}

		const child: Context = this.getChild(name);
		child.$release();

		delete this.children[name];

		return this;
	}

	public getLogger(): Logger {
		if (!isDefined(this.logger)) {
			this.logger = getLogger(this.getName());
		}

		return this.logger;
	}

	public $release(): void {
		forEachField(this.children, (key, child: Context) => {
			child.$release();
		});

		this.disposers.execute(this as unknown as C);
		this.children = {};
		this.logger = null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public tell(name: string, payload?: unknown): void {
		requireNotNull(name, "name");

		// TODO - Implement or remove
	}

	public sendToImmediateChildren(channelName: string, messageName: string, payload?: unknown): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
		});
	}

	public sendToDescendants(channelName: string, messageName: string, payload?: unknown): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
			child.send(To.DESCENDANTS, channelName, messageName, payload);
		});
	}

	public abstract init(): void;

	public abstract getRoot(): Context;

	public abstract isRoot(): boolean;

	protected forParent(callback: (parent: Context) => void): void {
		if (isDefined(callback)) {
			callback(this.getParent());
		}
	}

	protected forChildren(callback: (child: Context) => void): void {
		if (isDefined(callback)) {
			forEachField(this.children, (key, child: Context) => {
				callback(child);
			});
		}
	}

	protected runPreInitializers(): void {
		this.preInitializers.execute(this as unknown as C);
	}

	protected runInitializers(): void {
		this.initializers.execute(this as unknown as C);
	}

}

class RootContextImpl extends AbstractNamedContextImpl<Context> {

	public getFullName(): string {
		return this.getName();
	}

	public getRoot(): Context {
		return this;
	}

	public isRoot(): boolean {
		return true;
	}

	constructor() {
		super("Root");
	}

	public getParent(): Context {
		return this;
	}

	protected createProperties(): MutableProperties {
		return GlobalContextHolder.getContext().getProperties().extend();
	}

	protected createRegistry(): Registry {
		return (GlobalContextHolder.getContext() as unknown as InternalContext).getRegistry().extend(this);
	}

	protected createScope(): Scope {
		return GlobalContextHolder.getContext().getScope().extend();
	}

	public init(): void {
		this.getRegistry().registerPrototype(Ids.STAGE_COMPONENT, StageComponent, argumentsBuilder().withArgument(0).build(), true);

		this.getRegistry().registerSingleton(Ids.STAGE_INTERNALS, StageInternalsImpl,
			argumentsBuilder()
				.withContext()
				.with(Ids.STAGE)
				.with(Ids.ROOT_SELECTOR)
				.withArgument(0)
				.withArgument(1)
				.withArgument(2)
				.build(),
				true
		);
	}

}

class ChildContextImpl extends AbstractNamedContextImpl<Context> {

	public getFullName(): string {
		const segments: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let current: Context = this;

		while (!current.isRoot()) {
			segments.unshift(current.getName());
			current = current.getParent();
		}

		return segments.join(".");
	}

	private parent: Context;

	private root: Context;

	constructor(name: string, parent: Context) {
		super(name, parent);
		this.parent = requireNotNull(parent, "parent");
		this.root = parent.getRoot();
	}

	public expose(id: string): Context {
		requireValid(id, "id", OBJECT_ID);

		// TODO - Implement

		throw new Error("Method not supported until issue #651 is implemented.");
	}

	public getParent(): Context {
		return this.parent;
	}

	public isRoot(): boolean {
		return false;
	}

	public getRoot(): Context {
		return this.root;
	}

	public init(): void {
		// TODO - Implement
	}

	protected createProperties(parent: Context): MutableProperties {
		return parent.getProperties().extend();
	}

	protected createRegistry(parent: Context): Registry {
		return (parent as unknown as InternalContext).getRegistry().extend(this);
	}

	protected createScope(parent: Context): Scope {
		return parent.getScope().extend();
	}

	protected forParent(callback: (parent: Context) => void): void {
		callback(this.parent);
	}

}

export { RootContextImpl, AbstractNamedContextImpl };
