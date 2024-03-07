import PubSubImpl from "message/PubSubImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import PubSubTransitions from "message/PubSubTransitions";
import { Context } from "context/Context";

class PubSubArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return new PubSubImpl(null, context);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		const pubSub: PubSubImpl = param as PubSubImpl;
		pubSub.setTarget(targetObject);
		pubSub.tell(PubSubTransitions.MOUNT);
	}

}

export default PubSubArgumentResolver;