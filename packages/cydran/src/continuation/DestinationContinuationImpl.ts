import BehaviorInternals from "behavior/BehaviorInternals";
import ComponentInternals from "component/ComponentInternals";
import DestinationContinuation from "continuation/DestinationContinuation";
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

	public toSelf(): void {
		this.internals.message(this.channelName, this.messageName, this.payload);
	}

	public toContext(): void {
		this.internals.sendToContext(this.channelName, this.messageName, this.payload);
	}

	public globally(): void {
		this.internals.sendGlobally(this.channelName, this.messageName, this.payload);
	}

	public toParent(): void {
		this.internals.sendToParent(this.channelName, this.messageName, this.payload);
	}

	public toParents(): void {
		this.internals.sendToParents(this.channelName, this.messageName, this.payload);
	}

	public toChildren(): void {
		this.internals.sendToImmediateChildren(this.channelName, this.messageName, this.payload);
	}

	public toDescendants(): void {
		this.internals.sendToDescendants(this.channelName, this.messageName, this.payload);
	}

}

export default DestinationContinuationImpl;
