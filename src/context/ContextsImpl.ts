import Context from "context/Context";
import Contexts from "context/Contexts";
import SimpleMap from "interface/SimpleMap";
import ScopeImpl from "scope/ScopeImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import DEFAULT_PROPERTIES_VALUES from "SysProps";
import ContextImpl from "context/ContextImpl";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";
import Scope from "scope/Scope";
import COMPARE from "const/Compare";

import { MutableProperties } from "properties/Property";
import { isDefined, requireNotNull, requireValid, safeCydranDisposal } from "util/Utils";
import { DEFAULT_CONTEXT_KEY, VALID_ID } from "const/HardValues";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import DomWalker from "component/DomWalker";
import ComponentInternals from "component/ComponentInternals";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import Services from 'service/Services';
import { NamingConflictError, UndefinedContextError } from "error/Errors";
import IdGenerator from 'util/IdGenerator';

class ContextsImpl implements Contexts {

	public static getInstances(): Contexts[] {
		return ContextsImpl.INSTANCES;
	}

	public static resetInstances(): void {
		ContextsImpl.INSTANCES = [];
	}

	private static INSTANCES: Contexts[] = [];

	private readonly defaultContext: Context;

	private contexts: SimpleMap<Context>;

	private rootScope: ScopeImpl;

	private rootproperties: MutableProperties;

	private properties: MutableProperties;

	private services: Services;

	private walker: DomWalker<ComponentInternals>;

	private idGenerator: IdGenerator;

	constructor(services: Services) {
		this.idGenerator = new IdGenerator();
		this.services = requireNotNull(services, "dom");
		this.walker = new MvvmDomWalkerImpl(services);
		this.rootproperties = new PropertiesImpl();
		this.rootproperties.load(DEFAULT_PROPERTIES_VALUES);
		this.properties = this.rootproperties.extend() as MutableProperties;
		this.rootScope = new ScopeImpl();
		this.rootScope.add("compare", COMPARE);
		this.defaultContext = new ContextImpl(
			this.services,
			this.walker,
			DEFAULT_CONTEXT_KEY,
			this,
			this.rootScope,
			this.properties.extend()
		);
		this.contexts = {
			DEFAULT: this.defaultContext
		};

		ContextsImpl.INSTANCES.push(this);
	}

	public addContext(capabilityFn: (context: Context) => void): void {
		requireNotNull(capabilityFn, "capabilityFn");
		const name: string = "$$Cydran$$Anonymous-" + this.idGenerator.generate();
		this.addContextInternal(name, capabilityFn);
	}

	public addNamedContext(name: string, capabilityFn?: (context: Context) => void): void {
		requireValid(name, "name", VALID_ID);
		this.addContextInternal(name, capabilityFn);
	}

	private addContextInternal(name: string, capabilityFn: (context: Context) => void): void {
		if (isDefined(this.contexts[name])) {
			throw new NamingConflictError(`Context ${name} is already defined`);
		}

		const context: ContextImpl = new ContextImpl(this.services, this.walker, name, this, this.defaultContext.getScope() as ScopeImpl, this.properties.extend());

		this.contexts[name] = context;

		if (isDefined(capabilityFn)) {
			capabilityFn(context);
		}
	}

	public getContext(name: string): Context {
		requireNotNull(name, "name");

		if (!isDefined(this.contexts[name])) {
			throw new UndefinedContextError(`Context ${name} not found`);
		}

		return this.contexts[name];
	}

	public getDefaultContext(): Context {
		return this.getContext(DEFAULT_CONTEXT_KEY);
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.forEach((instance) => instance.broadcast(channelName, messageName, payload));
	}

	public registerConstant(id: string, instance: any): void {
		this.getDefaultContext().registerConstant(id, instance);
	}

	public registerConstantUnguarded(id: string, instance: any): void {
		(this.getDefaultContext() as ContextImpl).registerConstantUnguarded(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.getDefaultContext().registerPrototype(id, classInstance, resolvers);
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		this.getDefaultContext().registerPrototypeWithFactory(id, factoryFn, resolvers);
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.getDefaultContext().registerSingleton(id, classInstance, resolvers);
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		this.getDefaultContext().registerSingletonWithFactory(id, factoryFn, resolvers);
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.services.getBehaviorsRegistry().register(name, supportedTags, behaviorClass);
		this.getDefaultContext().getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public registerBehaviorFunction(name: string, supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.services.getBehaviorsRegistry().registerFunction(name, supportedTags, behavionFunction);
		this.getDefaultContext().getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public getScope(): Scope {
		return this.getDefaultContext().getScope();
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");

		let result: T = null;

		const contextId: string = ContextImpl.ALIASES[id];

		if (contextId) {
			result = this.getContext(id).getLocal(id);
		}

		if (!result) {
			result = this.defaultContext.getLocal(id);
		}

		return result;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public $dispose(): void {
		for (const key in this.contexts) {
			if (this.contexts.hasOwnProperty(key) && this.contexts[key]) {
				safeCydranDisposal(this.contexts[key]);
			}
		}

		const index: number = ContextsImpl.INSTANCES.indexOf(this);

		if (index > -1) {
			ContextsImpl.INSTANCES.splice(index, 1);
		}
	}

	private forEach(fn: (instace: Context) => void): void {
		requireNotNull(fn, "fn");

		for (const name in this.contexts) {
			if (!this.contexts.hasOwnProperty(name)) {
				continue;
			}

			const current: Context = this.contexts[name];

			fn(current);
		}
	}

}

export default ContextsImpl;
