import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { CallBackThisObject } from 'CydranTypes';
import MessageCallback from "message/MessageCallback";

class MessageSubscriberArgumentResolver implements ArgumentResolver<(thisObject: CallBackThisObject, callback: MessageCallback) => void> {

	public resolve(context: Context): (thisObject: CallBackThisObject, callback: MessageCallback) => void {
		return (thisObject: CallBackThisObject, callback: MessageCallback) => context.addListener(thisObject, callback);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: object, param: unknown): void {
		// Intentionally do nothing
	}

}

export default MessageSubscriberArgumentResolver;
