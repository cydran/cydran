import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';
import IdGenerator from "util/IdGenerator";

const idFn: Function = () => { return IdGenerator.INSTANCE.generate(); };

class InstanceIdFnArgumentResolver implements ArgumentResolver {

	public resolve(module: Module): any {
		return idFn;
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdFnArgumentResolver;
