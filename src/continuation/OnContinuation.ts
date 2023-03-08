import ForChannelContinuation from "continuation/ForChannelContinuation";

interface OnContinuation {

	invoke(callback: (payload: any) => void): void;

	forChannel(channelName: string): ForChannelContinuation;

}

export default OnContinuation;
