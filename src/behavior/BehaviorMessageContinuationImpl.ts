import MessageContinuation from "continuation/MessageContinuation";
import BehaviorInternals from 'behavior/BehaviorInternals';
import { requireNotNull } from 'util/Utils';

class BehaviorMessageContinuationImpl implements MessageContinuation {

	private internals: BehaviorInternals<any, any, any>;

	private channelName: string;

	private messageName: string;

	constructor(internals: BehaviorInternals<any, any, any>, channelName: string, messageName: string) {
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

export default BehaviorMessageContinuationImpl;
