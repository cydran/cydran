import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import Module from "module/Module";
import ModulesContext from "module/ModulesContext";
import Type from "interface/Type";
import SimpleMap from "interface/SimpleMap";
import Register from "registry/Register";
import RegistryImpl from "registry/RegistryImpl";
import ScopeImpl from "scope/ScopeImpl";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Scope from "scope/Scope";
import RegistryStrategy from "registry/RegistryStrategy";
import PubSub from "message/PubSub";
import PubSubImpl from "message/PubSubImpl";
import BrokerImpl from "message/BrokerImpl";
import Broker from "message/Broker";
import Listener from "message/Listener";

import { MutableProperties } from "properties/Property";
import { requireNotNull, requireValid } from "util/Utils";
import { MODULE_FIELD_NAME, VALID_ID } from "Constants";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import DomWalker from "component/DomWalker";
import ComponentInternals from "component/ComponentInternals";
import DomOperations from "dom/DomOperations";

class ModuleImpl implements Module, Register, Tellable {

	public static readonly ALIASES: SimpleMap<string> = {};

	private name: string;

	private registry: RegistryImpl;

	private broker: Broker;

	private scope: ScopeImpl;

	private modules: ModulesContext;

	private properties: MutableProperties;

	private domOperations: DomOperations;

	private walker: DomWalker<ComponentInternals>;

	constructor(
		domOperations: DomOperations,
		walker: DomWalker<ComponentInternals>,
		name: string,
		modules: ModulesContext,
		scope: ScopeImpl,
		properties: MutableProperties
	) {
		this.domOperations = requireNotNull(domOperations, "domOperations");
		this.walker = requireNotNull(walker, "walker");
		this.properties = requireNotNull(properties, "properties");
		this.name = name;
		this.registry = new RegistryImpl(this);
		this.broker = new BrokerImpl();
		this.scope = new ScopeImpl();
		this.modules = modules;

		if (scope) {
			this.scope.setParent(scope);
		}
	}

	public getLogger(): Logger {
		return LoggerFactory.getLogger(this.name);
	}

	public getName(): string {
		return this.name;
	}

	public associate(...componentClasses: Type<Nestable>[]): Module {
		componentClasses.forEach((componentClass) => {
			requireNotNull(componentClass, "componentClass");
			componentClass["prototype"][MODULE_FIELD_NAME] = this;
		});

		return this;
	}

	public disassociate(...componentClasses: Type<Nestable>[]): Module {
		componentClasses.forEach((componentClass) => {
			requireNotNull(componentClass, "componentClass");
			componentClass["prototype"][MODULE_FIELD_NAME] = this.getDefaultModule();
		});

		return this;
	}

	public clear(): Module {
		return this;
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.broker.broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.modules.broadcast(channelName, messageName, payload);
	}

	public tell(name: string, payload?: any): void {
		requireNotNull(name, "name");
		const actualPayload: any = payload === null || payload === undefined ? {} : payload;

		switch (name) {
			case "addListener":
				this.addListener(actualPayload as Listener);
				break;

			case "removeListener":
				this.removeListener(actualPayload as Listener);
				break;
		}
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		// Intentionally do nothing
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");

		let result: T = this.registry.get(id);

		if (!result) {
			result = this.modules.get(id);
		}

		return result;
	}

	public hasRegistration(id: string, moduleName?: string): boolean {
		const wkmod: Module = moduleName
			? this.getModule(moduleName)
			: this.getDefaultModule();
		return wkmod.hasRegistration(id);
	}

	public getLocal<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		return this.registry.get(id);
	}

	public getModule(name: string): Module {
		return this.modules.getModule(name);
	}

	public getDefaultModule(): Module {
		return this.modules.getDefaultModule();
	}

	public getScope(): Scope {
		return this.scope;
	}

	public registerConstant(id: string, instance: any): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(instance, "instance");
		this.registry.registerConstant(id, instance);
		return this;
	}

	public registerConstantUnguarded(id: string, instance: any): Module {
		requireNotNull(id, "id");
		requireNotNull(instance, "instance");
		this.registry.registerConstantUnguarded(id, instance);
		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerPrototype(id, classInstance, resolvers);
		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerPrototypeWithFactory(id, factoryFn, resolvers);
		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerSingleton(id, classInstance, resolvers);
		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerSingletonWithFactory(id, factoryFn, resolvers);
		return this;
	}

	public addStrategy(strategy: RegistryStrategy): Module {
		requireNotNull(strategy, "strategy");
		this.registry.addStrategy(strategy);
		return this;
	}

	public expose(id: string): Module {
		requireValid(id, "id", VALID_ID);
		ModuleImpl.ALIASES[id] = this.name;
		return this;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public createPubSubFor(context: any): PubSub {
		return new PubSubImpl(context, this);
	}

	private addListener(listener: Listener): void {
		this.broker.addListener(listener);
	}

	private removeListener(listener: Listener): void {
		this.broker.removeListener(listener);
	}

	public $dispose(): void {
		this.registry.$dispose();
	}

	public getDomWalker(): DomWalker<ComponentInternals> {
		return this.walker;
	}

	public getDomOperations(): DomOperations {
		return this.domOperations;
	}

}

export default ModuleImpl;
