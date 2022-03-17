import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';

class InstanceIdFnArgumentResolver implements ArgumentResolver {

	public resolve(module: Module): any {
		return () => { return module.getCydranContext().idGenerator().generate(); };
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdFnArgumentResolver;
