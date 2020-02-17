interface OnContinuation {

	invoke(target: (payload: any) => void): void;

	forChannel(name: string): ForChannelContinuation;

}

interface ForChannelContinuation {

	invoke(target: (payload: any) => void): void;

}

export { OnContinuation, ForChannelContinuation };
