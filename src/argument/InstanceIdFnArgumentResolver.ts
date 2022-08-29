import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';

class InstanceIdFnArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return () => { return context.getServices().idGenerator().generate(); };
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdFnArgumentResolver;
