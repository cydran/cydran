interface OnContinuation {

	invoke(target: Function): void;

	forChannel(name: string): ForChannelContinuation;

}

interface ForChannelContinuation {

	invoke(target: Function): void;

}

export { OnContinuation, ForChannelContinuation };
