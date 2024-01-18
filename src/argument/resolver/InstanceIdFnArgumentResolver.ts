import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { IdGenerator } from 'util/IdGenerator';

class InstanceIdFnArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return () => { return IdGenerator.generate(); };
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdFnArgumentResolver;
