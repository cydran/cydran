import ReceiverImpl from "message/ReceiverImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import Receiver from 'message/Receiver';

class ReceiverArgumentResolver implements ArgumentResolver<Receiver> {

	public resolve(context: Context): Receiver {
		return new ReceiverImpl(context);
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ReceiverArgumentResolver;
