import SimpleMap from "interface/SimpleMap";
import Logger from "log/Logger";
import PubSub from "message/PubSub";
import RegistryStrategy from "registry/RegistryStrategy";
import { requireNotNull, requireValid, defaultAsNull, isDefined, forEachField, defaulted } from 'util/Utils';
import { NamingConflictError, UnknownContextError } from "error/Errors";
import PubSubImpl from "message/PubSubImpl";
import LoggerFactory from "log/LoggerFactory";
import Initializers from "context/Initializers";
import InitializersImpl from "context/InitializersImpl";
import AbstractContextImpl from 'context/AbstractContextImpl';
import { Context } from 'context/Context';
import { VALID_ID, Ids } from "Constants";
import { MutableProperties } from "properties/Property";
import Registry from "registry/Registry";
import Scope from "scope/Scope";
import StageInternalsImpl from "stage/StageInternalsImpl";
import argumentsBuilder from "function/argumentsBuilder";
import GlobalContextHolder from 'context/GlobalContextHolder';
import StageComponent from 'stage/StageComponent';

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
		throw new Error("Method not implemented.");
	}

	public addPreInitializer(callback: (context?: Context) => void): void {
		this.preInitializers.add(callback);
	}

	public addInitializer(callback: (context?: Context) => void): void {
		this.initializers.add(callback);
	}

	public addDisposer(callback: (context?: Context) => void): void {
		this.disposers.add(callback);
	}

	public getChild(name: string): Context {
		return defaultAsNull(this.children[name]);
	}

	public hasChild(name: string): boolean {
		return isDefined(this.children[name]);
	}

	public addChild(name: string, initializer?: (context: Context) => void): Context {
		requireNotNull(name, "name");

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
		if (!this.hasChild(name)) {
			throw new UnknownContextError("Unknown child context: " + name);
		}

		const child: Context = this.getChild(name);
		child.$dispose();

		delete this.children[name];

		return this;
	}

	public getLogger(): Logger {
		if (!isDefined(this.logger)) {
			this.logger = LoggerFactory.getLogger(this.getName());
		}

		return this.logger;
	}

	public $dispose(): void {
		forEachField(this.children, (key, child: Context) => {
			child.$dispose();
		});

		this.disposers.execute(this as unknown as C);
		this.children = {};
		this.logger = null;
	}

	public addStrategy(strategy: RegistryStrategy): Context {
		this.getRegistry().addStrategy(strategy);

		return this;
	}

	public createPubSubFor(targetThis: any): PubSub {
		return new PubSubImpl(targetThis, this);
	}

	public tell(name: string, payload?: any): void {
		requireNotNull(name, "name");

		// TODO - Implement or remove
	}

	public sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
		});
	}

	public sendToDescendants(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
			child.sendToDescendants(channelName, messageName, payload);
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
		return GlobalContextHolder.getContext().getRegistry().extend(this);
	}

	protected createScope(): Scope {
		return GlobalContextHolder.getContext().getScope().extend();
	}

	public init(): void {
		this.getRegistry().registerPrototype(Ids.STAGE_COMPONENT, StageComponent, argumentsBuilder().withArgument(0).build());

		this.getRegistry().registerSingleton(Ids.STAGE_INTERNALS, StageInternalsImpl,
			argumentsBuilder().withContext().withLogger(Ids.STAGE_INTERNALS).withArgument(0).withArgument(1).withArgument(2).build());
	}

}

class ChildContextImpl extends AbstractNamedContextImpl<Context> {

	public getFullName(): string {
		const segments: string[] = [];
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
		requireValid(id, "id", VALID_ID);

		// TODO - Implement

		throw new Error("Method not implemented.");
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
		return parent.getRegistry().extend(this);
	}

	protected createScope(parent: Context): Scope {
		return parent.getScope().extend();
	}

	protected forParent(callback: (parent: Context) => void): void {
		callback(this.parent);
	}

}

export { RootContextImpl, AbstractNamedContextImpl };
