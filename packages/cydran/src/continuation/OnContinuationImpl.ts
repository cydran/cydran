import ForChannelContinuation from "continuation/ForChannelContinuation";
import OnContinuation from "continuation/OnContinuation";
import { requireNotNull } from "util/Utils";
import { INTERNAL_CHANNEL_NAME } from "CydranConstants";
import ComponentInternals from 'component/ComponentInternals';
import ForChannelContinuationImpl from './ForChannelContinuationImpl';

class OnContinuationImpl implements OnContinuation {

	private internals: ComponentInternals;

	private messageName: string;

	constructor(internals: ComponentInternals, messageName: string) {
		this.internals = requireNotNull(internals, "internals");
		this.messageName = requireNotNull(messageName, "messageName");
	}

	public invoke(callback: (payload: any) => void): void {
		requireNotNull(callback, "callback");
		this.internals.on(callback, this.messageName, INTERNAL_CHANNEL_NAME);
	}

	public forChannel(channelName: string): ForChannelContinuation {
		return new ForChannelContinuationImpl(this.internals, this.messageName, channelName);
	}

}

export default OnContinuationImpl;
