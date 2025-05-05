import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { requireNotNull } from 'util/Utils';

class PropertyFallbackSubscriberArgumentResolver implements ArgumentResolver<(thisObject: Object, callback: (key: string, value: unknown) => void) => void> {

	private preferredKey: string;
	
	private prefix?: string;

	constructor(preferredKey: string, prefix?: string) {
		this.preferredKey = requireNotNull(preferredKey, "preferredKey");
		this.prefix = prefix;
	}

	public resolve(context: Context): (thisObject: Object, callback: (key: string, value: unknown) => void) => void {
		const subscriber: (thisObject: Object, callback: (key: string, value: unknown) => void) => void
			= (thisObject: Object, callback: (key: string, value: unknown) => void) => {
				context.getProperties().addFallbackObserver(thisObject, callback, this.preferredKey, this.prefix);
			};

		return subscriber;
	}

	public postProcess(context: Context, targetObject: Object, param: unknown): void {
		// Intentionally do nothing
	}

}

export default PropertyFallbackSubscriberArgumentResolver;
