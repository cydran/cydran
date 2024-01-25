import SimpleMap from "interface/SimpleMap";
import Logger from "log/Logger";
import PubSub from "message/PubSub";
import RegistryStrategy from "registry/RegistryStrategy";
import { requireNotNull, requireValid, defaultAsNull, isDefined, forEachField, defaulted } from 'util/Utils';
import { NamingConflictError, UnknownContextError } from "error/Errors";
import PubSubImpl from "message/PubSubImpl";
import MessageCallback from "message/MessageCallback";
import Broker from "message/Broker";
import BrokerImpl from "message/BrokerImpl";
import LoggerFactory from "log/LoggerFactory";
import Initializers from "context/Initializers";
import InitializersImpl from "context/InitializersImpl";
import AbstractContextImpl from 'context/AbstractContextImpl';
import { Context, Stage } from 'context/Context';
import { VALID_ID } from "const/HardValues";
import { MutableProperties } from "properties/Property";
import Registry from "registry/Registry";
import Scope from "scope/Scope";
import StageInternalsImpl from "stage/StageInternalsImpl";
import { argumentsBuilder } from "const/Builder";
import GlobalContextHolder from 'context/GlobalContextHolder';
import StageComponent from 'stage/StageComponent';

abstract class AbstractNamedContextImpl<C extends Context> extends AbstractContextImpl<Context> implements Context {

	private children: SimpleMap<Context>;

	private logger: Logger;

	private broker: Broker;

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

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		this.message(channelName, messageName, payload);
	}

	public sendToParentContext(channelName: string, messageName: string, payload?: any): void {
		this.getParent().message(channelName, messageName, payload);
	}

	public sendToParentContexts(channelName: string, messageName: string, payload?: any): void {
		let current: Context = this.getParent();

		while (!current.isRoot()) {
			current.message(channelName, messageName, payload);
			current = current.getParent();
		}
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		this.getRoot().message(channelName, messageName, payload);
	}

	public sendToChildContexts(channelName: string, messageName: string, payload?: any): void {
		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
		});
	}

	public sendToDescendantContexts(channelName: string, messageName: string, payload?: any): void {
		forEachField(this.children, (key: string, child: Context) => {
			child.message(channelName, messageName, payload);
			child.sendToDescendantContexts(channelName, messageName, payload);
		});
	}

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getRoot().message(channelName, messageName, payload);
		this.getRoot().sendToDescendantContexts(channelName, messageName, payload);
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

	public message(channelName: string, messageName: string, payload?: any): void {
		this.getBroker().send(channelName, messageName, payload);
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

		switch (name) {
			case "addMessageCallback":
				this.addMessageCallback(defaulted(payload, {}) as MessageCallback);
				break;

			case "removeMessageCallback":
				this.removeMessageCallback(defaulted(payload, {}) as MessageCallback);
				break;
		}
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

	private addMessageCallback(callback: MessageCallback): void {
		this.getBroker().addMessageCallback(callback);
	}

	private removeMessageCallback(callback: MessageCallback): void {
		this.getBroker().removeMessageCallback(callback);
	}

	private getBroker(): Broker {
		if (!isDefined(this.broker)) {
			this.broker = new BrokerImpl(LoggerFactory.getLogger(`Broker`));
		}

		return this.broker;
	}

}

class RootContextImpl extends AbstractNamedContextImpl<Context> {

	public getRoot(): Context {
		return this;
	}

	public isRoot(): boolean {
		return true;
	}

	constructor() {
		super("Root");
	}

	public getStage(): Stage {
		return this.getObject("cydran:stage");
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
		this.getRegistry().registerPrototype("cydran:stageComponent", StageComponent, argumentsBuilder().withArgument(0).build());

		this.getRegistry().registerSingleton("cydran:stageInternals", StageInternalsImpl,
			argumentsBuilder().withContext().withLogger("stageInternals").withArgument(0).withArgument(1).withArgument(2).build());
	}

}

class ChildContextImpl extends AbstractNamedContextImpl<Context> {

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

	public getStage(): Stage {
		return this.getRoot().getStage();
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
