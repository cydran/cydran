import ForChannelContinuation from "message/ForChannelContinuation";

interface OnContinuation {

	invoke(target: (payload: any) => void): void;

	forChannel(name: string): ForChannelContinuation;

}

export default OnContinuation;
