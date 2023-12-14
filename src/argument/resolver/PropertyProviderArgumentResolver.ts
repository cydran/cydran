import ArgumentResolver from 'argument/ArgumentResolver';
import Context from "context/Context";
import { requireNotNull } from 'util/Utils';

class PropertyProviderArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
	}

	public resolve(context: Context): any {
		return () => context.getProperties().get(this.name);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default PropertyProviderArgumentResolver;
