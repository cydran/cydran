interface ForChannelContinuation {

	invoke(name: string, before?: () => void, after?: () => void): void;

}

export default ForChannelContinuation;
