import ReceiverImpl from "message/TransmitterImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";

class ReceiverArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return new ReceiverImpl(context);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ReceiverArgumentResolver;
