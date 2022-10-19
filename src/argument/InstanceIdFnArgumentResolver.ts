import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';
import InternalContext from "context/InternalContext";

class InstanceIdFnArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return () => { return (context as unknown as InternalContext).getServices().idGenerator().generate(); };
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdFnArgumentResolver;
