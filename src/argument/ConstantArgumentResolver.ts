import Context from "context/Context";
import ArgumentResolver from './ArgumentResolver';

class ConstantArgumentResolver implements ArgumentResolver {

	private value: any;

	constructor(value: any) {
		this.value = value;
	}

	public resolve(context: Context): any {
		return this.value;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ConstantArgumentResolver;
