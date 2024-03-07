interface Sendable {

	message(channelName: string, messageName: string, payload?: any): void;

	sendToContext(channelName: string, messageName: string, payload?: any): void;

	sendToParent(channelName: string, messageName: string, payload?: any): void;

	sendToParents(channelName: string, messageName: string, payload?: any): void;

	sendToRoot(channelName: string, messageName: string, payload?: any): void;

	sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void;

	sendToDescendants(channelName: string, messageName: string, payload?: any): void;

	sendGlobally(channelName: string, messageName: string, payload?: any): void;

}

export default Sendable;
