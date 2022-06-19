import ForChannelContinuation from "continuation/ForChannelContinuation";

interface OnContinuation {

	invoke(target: (payload: any) => void): void;

	forChannel(channelName: string): ForChannelContinuation;

}

export default OnContinuation;
