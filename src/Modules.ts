import {ModuleImpl} from "./Core";
import Module from "./Module";

class Modules {

	public static getModule(name: string): Module {
		if (!Modules.modules[name]) {
			Modules.modules[name] = new ModuleImpl(name);
		}

		return Modules.modules[name];
	}

	private static modules: {
		[id: string]: Module;
	} = {};

}

export default Modules;
