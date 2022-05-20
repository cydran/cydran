import ComponentInternals from "component/ComponentInternals";
import MessageContinuation from "component/continuation/MessageContinuation";
import { requireNotNull } from 'util/Utils';

class MessageContinuationImpl implements MessageContinuation {

	private internals: ComponentInternals;

	private channelName: string;

	private messageName: string;

	constructor(internals: ComponentInternals, channelName: string, messageName: string) {
		this.internals = requireNotNull(internals, "internals");
		this.channelName = requireNotNull(channelName, "channelName");
		this.messageName = requireNotNull(messageName, "messageName");
	}

	public self(payload?: any): void {
		this.internals.message(this.channelName, this.messageName, payload);
	}

	public module(payload?: any): void {
		this.internals.broadcast(this.channelName, this.messageName, payload);
	}

	public globally(payload?: any): void {
		this.internals.broadcastGlobally(this.channelName, this.messageName, payload);
	}

}

export default MessageContinuationImpl;
