import ForChannelContinuation from "continuation/ForChannelContinuation";

interface OnContinuation {

	invoke(name: string, before?: () => void, after?: () => void): void;

	forChannel(channelName: string): ForChannelContinuation;

}

export default OnContinuation;
