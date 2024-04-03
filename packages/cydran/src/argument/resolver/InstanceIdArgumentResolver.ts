import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { IdGenerator } from "util/IdGenerator";

class InstanceIdArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return IdGenerator.generate();
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdArgumentResolver;
