/**
 * Represents an object that can send messages to other objects.
 */
interface Sendable {
	/**
	 * Sends a message to a specific object.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	message(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Sends a message globally to all contexts.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	sendGlobally(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Sends a message to the current context.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	sendToContext(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Sends a message to all descendants of the current context.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	sendToDescendants(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Sends a message to all immediate children of the current context.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Sends a message to the parent of the current context.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	sendToParent(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Sends a message to all parents of the current context.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	sendToParents(channelName: string, messageName: string, payload?: any): void;

	/**
	 * Sends a message to the root object.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	sendToRoot(channelName: string, messageName: string, payload?: any): void;
}

export default Sendable;
