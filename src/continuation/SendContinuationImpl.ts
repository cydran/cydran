import DestinationContinuation from "continuation/DestinationContinuation";
import SendContinuation from "continuation/SendContinuation";
import ComponentInternals from 'component/ComponentInternals';
import { requireNotNull } from 'util/Utils';
import { INTERNAL_CHANNEL_NAME } from 'Constants';
import DestinationContinuationImpl from "continuation/DestinationContinuationImpl";

class SendContinuationImpl implements SendContinuation {

	private internals: ComponentInternals;

	private messageName: string;

	private payload: any;

	constructor(internals: ComponentInternals, messageName: string, payload: any) {
		this.internals = requireNotNull(internals, "internals");
		this.messageName = requireNotNull(messageName, "messageName");
		this.payload = payload;
	}

	public onChannel(channelName: string): DestinationContinuation {
		return new DestinationContinuationImpl(this.internals, channelName, this.messageName, this.payload);
	}

	public toSelf(): void {
		this.internals.message(INTERNAL_CHANNEL_NAME, this.messageName, this.payload);
	}

	public toContext(): void {
		this.internals.broadcast(INTERNAL_CHANNEL_NAME, this.messageName, this.payload);
	}

	public globally(): void {
		this.internals.broadcastGlobally(INTERNAL_CHANNEL_NAME, this.messageName, this.payload);
	}

}

export default SendContinuationImpl;
