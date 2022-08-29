import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';
import IdGenerator from "util/IdGenerator";

class InstanceIdArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return context.getServices().idGenerator().generate();
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdArgumentResolver;
