import Module from "module/Module";
import ArgumentResolver from 'stage/ArgumentResolver';
import { requireNotNull } from 'util/Utils';

class FunctionArgumentResolver implements ArgumentResolver {

	private fn: () => any;

	constructor(fn: () => any) {
		this.fn = requireNotNull(fn, "fn");
	}

	public resolve(module: Module): any {
		const instance: any = this.fn();

		return instance;
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default FunctionArgumentResolver;
