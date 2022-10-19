import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';
import InternalContext from "context/InternalContext";

class InstanceIdArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return (context as unknown as InternalContext).getServices().idGenerator().generate();
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdArgumentResolver;
