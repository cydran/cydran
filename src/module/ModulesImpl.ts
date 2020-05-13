import Module from "@/module/Module";
import ObjectUtils from "@/util/ObjectUtils";
import { VALID_ID } from "@/constant/ValidationRegExp";
import { DEFAULT_MODULE_KEY } from "@/constant/Constants";
import ScopeImpl from "@/model/ScopeImpl";
import Scope from "@/model/Scope";
import Factories from "@/mvvm/Factories";
import SimpleMap from "@/pattern/SimpleMap";
import Modules from "@/module/Modules";
import ModuleImpl from "@/module/ModuleImpl";

const requireNotNull = ObjectUtils.requireNotNull;
const requireValid = ObjectUtils.requireValid;

class ModulesImpl implements Modules {

	public static getInstances(): Modules[] {
		return ModulesImpl.INSTANCES;
	}

	public static resetInstances(): void {
		ModulesImpl.INSTANCES = [];
	}

	private static INSTANCES: Modules[] = [];

	private readonly defaultModule: Module;

	private modules: SimpleMap<Module>;

	constructor() {
		this.defaultModule = new ModuleImpl(DEFAULT_MODULE_KEY, this);
		this.modules = {
			DEFAULT: this.defaultModule
		};

		ModulesImpl.INSTANCES.push(this);
	}

	public getModule(name: string): Module {
		requireValid(name, "name", VALID_ID);

		if (!this.modules[name]) {
			this.modules[name] = new ModuleImpl(name, this, this.defaultModule.getScope() as ScopeImpl);
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

	public registerPrototype(id: string, classInstance: any, dependencies: string[]): void {
		this.getDefaultModule().registerPrototype(id, classInstance, dependencies);
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void {
		this.getDefaultModule().registerPrototypeWithFactory(id, factoryFn, dependencies);
	}

	public registerSingleton(id: string, classInstance: any, dependencies: string[]): void {
		this.getDefaultModule().registerSingleton(id, classInstance, dependencies);
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void {
		this.getDefaultModule().registerSingletonWithFactory(id, factoryFn, dependencies);
	}

	public registerElementMediator(name: string, supportedTags: string[], elementMediatorClass: any): void {
		Factories.register(name, supportedTags, elementMediatorClass);
	}

	public getScope(): Scope {
		return this.getDefaultModule().getScope();
	}

	public get<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
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

}

export default ModulesImpl;