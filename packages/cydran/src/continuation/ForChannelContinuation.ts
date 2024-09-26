interface ForChannelContinuation {

	// TODO - Correct objectThis for callbacks and weakly reference
	invoke(callback: (payload: any) => void): void;

}

export default ForChannelContinuation;
