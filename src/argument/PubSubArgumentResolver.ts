import PubSubImpl from "message/PubSubImpl";
import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';

class PubSubArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return new PubSubImpl(null, context);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		const pubSub: PubSubImpl = param as PubSubImpl;
		pubSub.setTarget(targetObject);
	}

}

export default PubSubArgumentResolver;
