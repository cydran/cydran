import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';
import IdGenerator from "util/IdGenerator";

class InstanceIdArgumentResolver implements ArgumentResolver {

	public resolve(module: Module): any {
		return IdGenerator.INSTANCE.generate();
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdArgumentResolver;
