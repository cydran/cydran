import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';
import { requireNotNull } from 'util/Utils';

class PropertyArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
	}

	public resolve(context: Context): any {
		const value: any = context.getProperties().get(this.name);

		return value;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default PropertyArgumentResolver;
