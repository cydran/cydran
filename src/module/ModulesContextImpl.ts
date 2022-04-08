import Module from "module/Module";
import ModulesContext from "module/ModulesContext";
import SimpleMap from "interface/SimpleMap";
import ScopeImpl from "scope/ScopeImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import DEFAULT_PROPERTIES_VALUES from "SysProps";
import ModuleImpl from "module/ModuleImpl";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";
import Scope from "scope/Scope";
import COMPARE from "const/Compare";

import { MutableProperties } from "properties/Property";
import { requireNotNull, requireValid, safeCydranDisposal } from "util/Utils";
import { DEFAULT_MODULE_KEY, VALID_ID } from "const/HardValues";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import DomWalker from "component/DomWalker";
import ComponentInternals from "component/ComponentInternals";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import CydranContext from 'context/CydranContext';

class ModulesContextImpl implements ModulesContext {

	public static getInstances(): ModulesContext[] {
		return ModulesContextImpl.INSTANCES;
	}

	public static resetInstances(): void {
		ModulesContextImpl.INSTANCES = [];
	}

	private static INSTANCES: ModulesContext[] = [];

	private readonly defaultModule: Module;

	private modules: SimpleMap<Module>;

	private rootScope: ScopeImpl;

	private rootproperties: MutableProperties;

	private properties: MutableProperties;

	private cydranContext: CydranContext;

	private walker: DomWalker<ComponentInternals>;

	constructor(cydranContext: CydranContext) {
		this.cydranContext = requireNotNull(cydranContext, "dom");
		this.walker = new MvvmDomWalkerImpl(cydranContext);
		this.rootproperties = new PropertiesImpl();
		this.rootproperties.load(DEFAULT_PROPERTIES_VALUES);
		this.properties = this.rootproperties.extend() as MutableProperties;
		this.rootScope = new ScopeImpl();
		this.rootScope.add("compare", COMPARE);
		this.defaultModule = new ModuleImpl(
			this.cydranContext,
			this.walker,
			DEFAULT_MODULE_KEY,
			this,
			this.rootScope,
			this.properties.extend()
		);
		this.modules = {
			DEFAULT: this.defaultModule
		};

		ModulesContextImpl.INSTANCES.push(this);
	}

	public getModule(name: string): Module {
		requireValid(name, "name", VALID_ID);

		if (!this.modules[name]) {
			this.modules[name] = new ModuleImpl(this.cydranContext, this.walker, name, this, this.defaultModule.getScope() as ScopeImpl, this.properties.extend());
		}

		return this.modules[name];
	}

	public getDefaultModule(): Module {
		return this.getModule(DEFAULT_MODULE_KEY);
	}

	public forEach(fn: (instace: Module) => void): void {
		requireNotNull(fn, "fn");

		for (const name in this.modules) {
			if (!this.modules.hasOwnProperty(name)) {
				continue;
			}

			const current: Module = this.modules[name];

			fn(current);
		}
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		this.forEach((instance) => instance.broadcast(channelName, messageName, payload));
	}

	public registerConstant(id: string, instance: any): void {
		this.getDefaultModule().registerConstant(id, instance);
	}

	public registerConstantUnguarded(id: string, instance: any): void {
		(this.getDefaultModule() as ModuleImpl).registerConstantUnguarded(id, instance);
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.getDefaultModule().registerPrototype(id, classInstance, resolvers);
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		this.getDefaultModule().registerPrototypeWithFactory(id, factoryFn, resolvers);
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.getDefaultModule().registerSingleton(id, classInstance, resolvers);
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		this.getDefaultModule().registerSingletonWithFactory(id, factoryFn, resolvers);
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.cydranContext.getBehaviorsRegistry().register(name, supportedTags, behaviorClass);
		this.getDefaultModule().getLogger().ifDebug(() => `Registered behavior: ${name} : ${ supportedTags.toString() }`);
	}

	public registerBehaviorFunction(name: string, supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.cydranContext.getBehaviorsRegistry().registerFunction(name, supportedTags, behavionFunction);
		this.getDefaultModule().getLogger().ifDebug(() => `Registered behavior: ${name} : ${ supportedTags.toString() }`);
	}

	public getScope(): Scope {
		return this.getDefaultModule().getScope();
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");

		let result: T = null;

		const moduleId: string = ModuleImpl.ALIASES[id];

		if (moduleId) {
			result = this.getModule(id).getLocal(id);
		}

		if (!result) {
			result = this.defaultModule.getLocal(id);
		}

		return result;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public $dispose(): void {
		for (const key in this.modules) {
			if (this.modules.hasOwnProperty(key) && this.modules[key]) {
				safeCydranDisposal(this.modules[key]);
			}
		}

		const index: number = ModulesContextImpl.INSTANCES.indexOf(this);

		if (index > -1) {
			ModulesContextImpl.INSTANCES.splice(index, 1);
		}
	}

}

export default ModulesContextImpl;
