import BehaviorInternals from "behavior/BehaviorInternals";
import ComponentInternals from "component/ComponentInternals";
import DestinationContinuation from "continuation/DestinationContinuation";
import { To } from "CydranConstants";
import { requireNotNull } from "util/Utils";

class DestinationContinuationImpl implements DestinationContinuation {

	private internals: BehaviorInternals<any, any, any> | ComponentInternals;

	private channelName: string;

	private messageName: string;

	private payload: any;

	constructor(internals: BehaviorInternals<any, any, any> | ComponentInternals, channelName: string, messageName: string, payload: any) {
		this.internals = requireNotNull(internals, "internals");
		this.channelName = requireNotNull(channelName, "channelName");
		this.messageName = requireNotNull(messageName, "messageName");
		this.payload = payload;
	}

	public withPropagation(propagation: To): void {
		this.internals.send(propagation, this.channelName, this.messageName, this.payload);
	}

	public toSelf(): void {
		this.internals.message(this.channelName, this.messageName, this.payload);
	}

}

export default DestinationContinuationImpl;
