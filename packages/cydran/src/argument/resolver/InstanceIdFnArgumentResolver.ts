import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { IdGenerator } from 'util/IdGenerator';

class InstanceIdFnArgumentResolver implements ArgumentResolver<() => string> {

	public resolve(context: Context): () => string {
		return () => { return IdGenerator.generate(); };
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default InstanceIdFnArgumentResolver;
