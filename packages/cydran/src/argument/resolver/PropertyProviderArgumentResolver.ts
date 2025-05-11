import ArgumentResolver from 'argument/ArgumentResolver';
import { PROPERTY_KEY } from 'CydranConstants';
import { Context } from "context/Context";
import { requireValid } from 'util/Utils';
import { PropertyProvider } from 'CydranTypes';

class PropertyProviderArgumentResolver implements ArgumentResolver<unknown> {

	private name: string;

	constructor(name: string) {
		this.name = requireValid(name, "name", PROPERTY_KEY);
	}

	public resolve(context: Context): PropertyProvider<unknown> {
		return () => context.getProperties().get(this.name);
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default PropertyProviderArgumentResolver;
