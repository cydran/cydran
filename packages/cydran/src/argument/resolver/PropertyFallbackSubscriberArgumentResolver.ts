import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { CallBackThisObject, PropertyFallBackSubscriber, PropertyChangeFallbackCallback } from 'CydranTypes';
import { requireNotNull } from 'util/Utils';

class PropertyFallbackSubscriberArgumentResolver implements ArgumentResolver<PropertyFallBackSubscriber<unknown>> {

	private preferredKey: string;
	
	private prefix?: string;

	constructor(preferredKey: string, prefix?: string) {
		this.preferredKey = requireNotNull(preferredKey, "preferredKey");
		this.prefix = prefix;
	}

	public resolve(context: Context): PropertyFallBackSubscriber<unknown> {
		const subscriber: PropertyFallBackSubscriber<unknown> = (thisObject: CallBackThisObject, callback: PropertyChangeFallbackCallback<unknown>) => {
				context.getProperties().addFallbackObserver(thisObject, callback, this.preferredKey, this.prefix);
			};

		return subscriber;
	}

	public postProcess(context: Context, targetObject: Object, param: unknown): void {
		// Intentionally do nothing
	}

}

export default PropertyFallbackSubscriberArgumentResolver;
