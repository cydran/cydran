import ArgumentResolver from 'argument/ArgumentResolver';
import { PROPERTY_KEY } from 'CydranConstants';
import { Context } from "context/Context";
import { requireValid } from 'util/Utils';
import { CallBackThisObject, PropertyChangeCallback, PropertySubscriber } from 'CydranTypes';

class PropertySubscriberArgumentResolver implements ArgumentResolver<PropertySubscriber> {

	private name: string;

	constructor(name: string) {
		this.name = requireValid(name, "name", PROPERTY_KEY);
	}

	public resolve(context: Context): PropertySubscriber {
		const subscriber: PropertySubscriber = (thisObject: CallBackThisObject, callback: PropertyChangeCallback) => {
			context.getProperties().addPropertyObserver(this.name, thisObject, callback);
		};

		return subscriber;
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default PropertySubscriberArgumentResolver;
