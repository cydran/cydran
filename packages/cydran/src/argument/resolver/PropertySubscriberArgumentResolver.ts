import ArgumentResolver from 'argument/ArgumentResolver';
import { PROPERTY_KEY } from 'CydranConstants';
import { Context } from "context/Context";
import { requireValid } from 'util/Utils';

class PropertySubscriberArgumentResolver implements ArgumentResolver<(thisObject: Object, callback: (value: unknown) => void) => void> {

	private name: string;

	constructor(name: string) {
		this.name = requireValid(name, "name", PROPERTY_KEY);
	}

	public resolve(context: Context): (thisObject: Object, callback: (value: unknown) => void) => void {
		const subscriber: (thisObject: Object, callback: (value: unknown) => void) => void = (thisObject: Object, callback: (value: unknown) => void) => {
			context.getProperties().addPropertyObserver(this.name, thisObject, callback);
		};

		return subscriber;
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default PropertySubscriberArgumentResolver;
