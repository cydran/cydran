interface Sendable {

	message(channelName: string, messageName: string, payload?: any): void;

	sendToContext(channelName: string, messageName: string, payload?: any): void;

	sendToParentContext(channelName: string, messageName: string, payload?: any): void;

	sendToParentContexts(channelName: string, messageName: string, payload?: any): void;

	sendToRoot(channelName: string, messageName: string, payload?: any): void;

	sendToChildContexts(channelName: string, messageName: string, payload?: any): void;

	sendToDescendantContexts(channelName: string, messageName: string, payload?: any): void;

	sendGlobally(channelName: string, messageName: string, payload?: any): void;

}

export default Sendable;
