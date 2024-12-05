import ReceiverImpl from "message/TransmitterImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import MessageCallback from "message/MessageCallback";

class MessageSubscriberArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return (thisObject: Object, callback: MessageCallback) => context.addListener(thisObject, callback);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default MessageSubscriberArgumentResolver;
