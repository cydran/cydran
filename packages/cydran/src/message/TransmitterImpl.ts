import { isDefined } from 'util/Utils';
import { Context } from 'context/Context';
import { ContextUnavailableError } from "error/Errors";
import Transmitter from 'message/Transmitter';

class TransmitterImpl implements Transmitter {

	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public setContext(context: Context): void {
		this.context = context;
	}

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendGlobally(channelName, messageName, payload);
	}

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToContext(channelName, messageName, payload);
	}

	public sendToDescendants(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToDescendants(channelName, messageName, payload);
	}

	public sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToImmediateChildren(channelName, messageName, payload);
	}

	public sendToParent(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToParent(channelName, messageName, payload);
	}

	public sendToParents(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToParents(channelName, messageName, payload);
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		this.getContext().sendToRoot(channelName, messageName, payload);
	}

	private getContext(): Context {
		if (!isDefined(this.context)) {
			throw new ContextUnavailableError("Context is not available for messaging.");
		}

		return this.context;
	}

}

export default TransmitterImpl;