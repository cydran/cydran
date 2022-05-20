interface MessageContinuation {

	self(payload?: any): void;

	module(payload?: any): void;

	globally(payload?: any): void;

}

export default MessageContinuation;
