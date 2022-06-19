import ComponentInternals from "component/ComponentInternals";
import ForChannelContinuation from "continuation/ForChannelContinuation";
import { requireNotNull } from "util/Utils";

class ForChannelContinuationImpl implements ForChannelContinuation {

	private internals: ComponentInternals;

	private messageName: string;

	private channelName: string;

	constructor(internals: ComponentInternals, messageName: string, channelName: string) {
		this.internals = requireNotNull(internals, "internals");
		this.messageName = requireNotNull(messageName, "messageName");
		this.channelName = requireNotNull(channelName, "channelName");
	}

	invoke(target: (payload: any) => void): void {
		requireNotNull(target, "target");
		this.internals.on(target, this.messageName, this.channelName);
	}

}

export default ForChannelContinuationImpl;
