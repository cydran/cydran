import ArgumentResolver from 'argument/ArgumentResolver';
import { PROPERTY_KEY } from 'Constants';
import { Context } from "context/Context";
import { requireValid } from 'util/Utils';

class PropertyProviderArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(name: string) {
		this.name = requireValid(name, "name", PROPERTY_KEY);
	}

	public resolve(context: Context): any {
		return () => context.getProperties().get(this.name);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default PropertyProviderArgumentResolver;
