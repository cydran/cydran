import PubSubImpl from "message/PubSubImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";

class PubSubArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return new PubSubImpl(null, context);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default PubSubArgumentResolver;
