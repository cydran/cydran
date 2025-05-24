import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import MessageCallback from "message/MessageCallback";

class MessageSubscriberArgumentResolver implements ArgumentResolver<(thisObject: Object, callback: MessageCallback) => void> {

	public resolve(context: Context): (thisObject: Object, callback: MessageCallback) => void {
		return (thisObject: Object, callback: MessageCallback) => context.addListener(thisObject, callback);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default MessageSubscriberArgumentResolver;
