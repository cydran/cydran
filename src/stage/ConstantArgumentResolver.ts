import Module from "module/Module";
import ArgumentResolver from './ArgumentResolver';

class ConstantArgumentResolver implements ArgumentResolver {

	private value: any;

	constructor(value: any) {
		this.value = value;
	}

	public resolve(module: Module): any {
		return this.value;
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ConstantArgumentResolver;
