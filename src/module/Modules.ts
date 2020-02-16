import Module from "@/module/Module";
import ObjectUtils from "@/util/ObjectUtils";
import { VALID_ID } from "@/constant/ValidationRegExp";
import { DEFAULT_MODULE_KEY } from "@/constant/Constants";
import ScopeImpl from "@/model/ScopeImpl";
import ModuleImpl from "@/module/ModuleImpl";
import Scope from "@/model/Scope";
import ElementMediatorFactories from "@/mvvm/ElementMediatorFactories";
const requireNotNull = ObjectUtils.requireNotNull;
const requireValid = ObjectUtils.requireValid;

class Modules {

	public static getModule(name: string): Module {
		requireValid(name, "name", VALID_ID);

		if (!Modules.modules[name]) {
			Modules.modules[name] = new ModuleImpl(name, ModuleImpl.DEFAULT_MODULE.getScope() as ScopeImpl);
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

	public static registerSingleton(id: string, classInstance: any, dependencies: string[]): void {
		this.getDefaultModule().registerSingleton(id, classInstance, dependencies);
	}

	public static registerElementMediator(name: string, supportedTags: string[], elementMediatorClass: any): void {
		ElementMediatorFactories.register(name, supportedTags, elementMediatorClass);
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
			result = ModuleImpl.DEFAULT_MODULE.getLocal(id);
		}

		return result;
	}

	private static modules: {
		[id: string]: Module;
	} = {
			DEFAULT: ModuleImpl.DEFAULT_MODULE
		};

}

export default Modules;
