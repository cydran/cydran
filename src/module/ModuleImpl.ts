import Module from "@/module/Module";
import Register from "@/registry/Register";
import SimpleMap from "@/pattern/SimpleMap";
import { Registry, RegistryImpl } from "@/registry/Registry";
import Broker from "@/message/Broker";
import ScopeImpl from "@/model/ScopeImpl";
import BrokerImpl from "@/message/BrokerImpl";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import { MODULE_FIELD_NAME, INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Listener from "@/message/Listener";
import ModulesContext from "@/module/ModulesContext";
import { VALID_ID } from "@/constant/ValidationRegExp";
import Scope from "@/model/Scope";
import RegistrationError from "@/error/RegistrationError";
import RegistryStrategy from "@/registry/RegistryStrategy";
import PubSub from "@/message/PubSub";
import PubSubImpl from "@/message/PubSubImpl";
import Type from "@/type/Type";
import Nestable from "@/component/Nestable";
import { requireNotNull, requireValid } from "@/util/ObjectUtils";

class ModuleImpl implements Module, Register {

	public static readonly ALIASES: SimpleMap<string> = {};

	private name: string;

	private registry: Registry;

	private broker: Broker;

	private scope: ScopeImpl;

	private modules: ModulesContext;

	constructor(name: string, modules: ModulesContext, scope?: ScopeImpl) {
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
			componentClass["prototype"][MODULE_FIELD_NAME] = this;
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

	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		const actualPayload: any = (payload === null || payload === undefined) ? {} : payload;

		if (channelName === INTERNAL_DIRECT_CHANNEL_NAME) {
			if (messageName === "addListener") {
				this.addListener(actualPayload as Listener);
			} else if (messageName === "removeListener") {
				this.removeListener(actualPayload as Listener);
			}
		}
	}

	public get<T>(id: string): T {
		requireValid(id, "id", VALID_ID);

		let result: T = this.registry.get(id);

		if (!result) {
			result = this.modules.get(id);
		}

		return result;
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

	public registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerPrototypeWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): Module {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerSingletonWithFactory(id, factoryFn, dependencies);
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

	public createPubSubFor(context: any): PubSub {
		return new PubSubImpl(context, this);
	}

	private addListener(listener: Listener): void {
		this.broker.addListener(listener);
	}

	private removeListener(listener: Listener): void {
		this.broker.removeListener(listener);
	}

	private logError(e: RegistrationError) {
		this.getLogger().error(e);
	}

}

export default ModuleImpl;
