import ArgumentResolver from 'argument/ArgumentResolver';
import { PROPERTY_KEY } from 'Constants';
import { Context } from "context/Context";
import { requireValid } from 'util/Utils';

class PropertyHookArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(name: string) {
		this.name = requireValid(name, "name", PROPERTY_KEY);
	}

	public resolve(context: Context): any {
		const hook: (thisObject: any, callback: (value: any) => void) => void = (thisObject: any, callback: (value: any) => void) => {
			context.getProperties().addPropertyObserver(this.name, thisObject, callback);
		};

		return hook;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default PropertyHookArgumentResolver;
