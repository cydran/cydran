import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { requireNotNull } from 'util/Utils';

class PropertyHookArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
	}

	public resolve(context: Context): any {
		const hook: (callback: (value: any) => void) => void = (callback: (value: any) => void) => {
			context.getProperties().addPropertyObserver(this.name, callback);
		};

		return hook;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default PropertyHookArgumentResolver;
