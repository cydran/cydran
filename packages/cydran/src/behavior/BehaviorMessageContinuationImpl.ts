import BehaviorInternals from 'behavior/BehaviorInternals';
import { requireNotNull } from 'util/Utils';
import SendContinuation from "continuation/SendContinuation";
import DestinationContinuation from 'continuation/DestinationContinuation';
import DestinationContinuationImpl from "continuation/DestinationContinuationImpl";
import { INTERNAL_CHANNEL_NAME, To } from "CydranConstants";
import ComponentInternals from 'component/ComponentInternals';

class BehaviorMessageContinuationImpl implements SendContinuation {

	private internals: BehaviorInternals<any, any, any> | ComponentInternals;

	private messageName: string;

	private payload: any;

	constructor(internals: BehaviorInternals<any, any, any>, messageName: string, payload: any) {
		this.internals = requireNotNull(internals, "internals");
		this.messageName = requireNotNull(messageName, "messageName");
		this.payload = payload;
	}

	public withPropagation(propagation: To): void {
		this.internals.send(propagation, INTERNAL_CHANNEL_NAME, this.messageName, this.payload);
	}

	public onChannel(channelName: string): DestinationContinuation {
		return new DestinationContinuationImpl(this.internals, channelName, this.messageName, this.payload);
	}

	public toSelf(): void {
		this.internals.message(INTERNAL_CHANNEL_NAME, this.messageName, this.payload);
	}

}

export default BehaviorMessageContinuationImpl;
