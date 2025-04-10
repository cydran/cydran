import { isDefined } from 'util/Utils';
import { Context } from 'context/Context';
import { ContextUnavailableError } from "error/Errors";
import Transmitter from 'message/Transmitter';
import { To } from 'CydranConstants';

class TransmitterImpl implements Transmitter {

	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public setContext(context: Context): void {
		this.context = context;
	}

	public send(propagation: To, channelName: string, messageName: string, payload?: any, startFrom?: string): void {
		this.getContext().send(propagation, channelName, messageName, payload, startFrom);
	}

	private getContext(): Context {
		if (!isDefined(this.context)) {
			throw new ContextUnavailableError("Context is not available for messaging.");
		}

		return this.context;
	}

}

export default TransmitterImpl;
