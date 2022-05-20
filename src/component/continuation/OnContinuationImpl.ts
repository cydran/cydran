import ForChannelContinuation from "component/continuation/ForChannelContinuation";
import OnContinuation from "component/continuation/OnContinuation";
import { requireNotNull } from "util/Utils";
import { INTERNAL_CHANNEL_NAME } from "Constants";
import ComponentInternals from 'component/ComponentInternals';
import ForChannelContinuationImpl from './ForChannelContinuationImpl';

class OnContinuationImpl implements OnContinuation {

	private internals: ComponentInternals;

	private messageName: string;

	constructor(internals: ComponentInternals, messageName: string) {
		this.internals = requireNotNull(internals, "internals");
		this.messageName = requireNotNull(messageName, "messageName");
	}

	public invoke(target: (payload: any) => void): void {
		requireNotNull(target, "target");
		this.internals.on(target, this.messageName, INTERNAL_CHANNEL_NAME);
	}

	public forChannel(channelName: string): ForChannelContinuation {
		return new ForChannelContinuationImpl(this.internals, this.messageName, channelName);
	}

}

export default OnContinuationImpl;
