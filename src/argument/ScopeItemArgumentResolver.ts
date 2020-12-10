import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';
import { requireNotNull } from 'util/Utils';
import ScopeImpl from 'scope/ScopeImpl';

class ScopeItemArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
	}

	public resolve(module: Module): any {
		const value: any = (module.getScope() as ScopeImpl).get(this.name);

		return value;
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ScopeItemArgumentResolver;
