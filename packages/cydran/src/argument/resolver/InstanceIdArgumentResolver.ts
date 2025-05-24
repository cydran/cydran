import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { IdGenerator } from "util/IdGenerator";

class InstanceIdArgumentResolver implements ArgumentResolver<string> {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resolve(context: Context): string {
		return IdGenerator.generate();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default InstanceIdArgumentResolver;
