import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { requireNotNull } from 'util/Utils';

class PropertyFallbackSubscriberArgumentResolver implements ArgumentResolver {

	private preferredKey: string;
	
	private prefix?: string;

	constructor(preferredKey: string, prefix?: string) {
		this.preferredKey = requireNotNull(preferredKey, "preferredKey");
		this.prefix = prefix;
	}

	public resolve(context: Context): any {
		const subscriber: (thisObject: Object, callback: (key: string, value: any) => void) => void
			= (thisObject: Object, callback: (key: string, value: any) => void) => {
				context.getProperties().addFallbackObserver(thisObject, callback, this.preferredKey, this.prefix);
			};

		return subscriber;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default PropertyFallbackSubscriberArgumentResolver;
