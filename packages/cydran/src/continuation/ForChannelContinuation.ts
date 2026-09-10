interface ForChannelContinuation {

	invoke(callback: (payload: unknown) => void, before?: () => void, after?: () => void): void;

}

export default ForChannelContinuation;
