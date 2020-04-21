import Module from "@/module/Module";
import ObjectUtils from "@/util/ObjectUtils";
import { VALID_ID } from "@/constant/ValidationRegExp";
import { DEFAULT_MODULE_KEY } from "@/constant/Constants";
import ScopeImpl from "@/model/ScopeImpl";
import Scope from "@/model/Scope";
import Factories from "@/mvvm/Factories";
import LoggerFactory from "@/logger/LoggerFactory";
import Logger from "@/logger/Logger";
import Register from "@/registry/Register";
import { Registry, RegistryImpl, RegistryStrategy } from "@/registry/Registry";
import Broker from "@/message/Broker";
import BrokerImpl from "@/message/BrokerImpl";
import { MODULE_FIELD_NAME, INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Listener from "@/message/Listener";
import RegistrationError from "@/error/RegistrationError";
import SimpleMap from "@/pattern/SimpleMap";

const requireNotNull = ObjectUtils.requireNotNull;
const requireValid = ObjectUtils.requireValid;

class ModuleImpl implements Module, Register {

	public static readonly ALIASES: SimpleMap<string> = {};

	private name: string;

	private registry: Registry;

	private broker: Broker;

	private scope: ScopeImpl;

	constructor(name: string, scope?: ScopeImpl) {
		this.name = name;
		this.registry = new RegistryImpl();
		this.broker = new BrokerImpl();
		this.scope = new ScopeImpl();

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

	public associate(...componentClasses: any[]): Module {
		componentClasses.forEach((componentClass) => {
			requireNotNull(componentClass, "componentClass");
			componentClass["prototype"][MODULE_FIELD_NAME] = this;
		});

		return this;
	}

	public disassociate(...componentClasses: any[]): Module {
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
			result = Modules.get(id);
		}

		return result;
	}

	public getLocal<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		return this.registry.get(id);
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

	public registerPrototype(id: string, classInstance: any, dependencies?: string[]): Module {
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

	public registerSingleton(id: string, classInstance: any, dependencies?: string[]): Module {
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

class Modules {

	public static readonly DEFAULT_MODULE: Module = new ModuleImpl(DEFAULT_MODULE_KEY);

	public static getModule(name: string): Module {
		requireValid(name, "name", VALID_ID);

		if (!Modules.modules[name]) {
			Modules.modules[name] = new ModuleImpl(name, Modules.DEFAULT_MODULE.getScope() as ScopeImpl);
		}

		return Modules.modules[name];
	}

	public static getDefaultModule(): Module {
		return this.getModule(DEFAULT_MODULE_KEY);
	}

	public static forEach(fn: (instace: Module) => void): void {
		requireNotNull(fn, "fn");

		for (const name in Modules.modules) {
			if (!Modules.modules.hasOwnProperty(name)) {
				continue;
			}

			const current: Module = Modules.modules[name];

			fn(current);
		}
	}

	public static broadcast(channelName: string, messageName: string, payload?: any): void {
		Modules.forEach((instance) => instance.broadcast(channelName, messageName, payload));
	}

	public static registerConstant(id: string, instance: any): void {
		this.getDefaultModule().registerConstant(id, instance);
	}

	public static registerPrototype(id: string, classInstance: any, dependencies: string[]): void {
		this.getDefaultModule().registerPrototype(id, classInstance, dependencies);
	}

	public static registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void {
		this.getDefaultModule().registerPrototypeWithFactory(id, factoryFn, dependencies);
	}

	public static registerSingleton(id: string, classInstance: any, dependencies: string[]): void {
		this.getDefaultModule().registerSingleton(id, classInstance, dependencies);
	}

	public static registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void {
		this.getDefaultModule().registerSingletonWithFactory(id, factoryFn, dependencies);
	}

	public static registerElementMediator(name: string, supportedTags: string[], elementMediatorClass: any): void {
		Factories.register(name, supportedTags, elementMediatorClass);
	}

	public static getScope(): Scope {
		return this.getDefaultModule().getScope();
	}

	public static get<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		let result: T = null;

		const moduleId: string = ModuleImpl.ALIASES[id];

		if (moduleId) {
			result = Modules.getModule(id).getLocal(id);
		}

		if (!result) {
			result = Modules.DEFAULT_MODULE.getLocal(id);
		}

		return result;
	}

	private static modules: SimpleMap<Module> = {
		DEFAULT: Modules.DEFAULT_MODULE
	};

}

export { Modules, ModuleImpl } ;
