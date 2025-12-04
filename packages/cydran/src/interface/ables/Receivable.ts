interface Receivable {

	/**
	 * Sends a message to a specific object.
	 * @param channelName The name of the channel to send the message to.
	 * @param messageName The name of the message to send.
	 * @param payload The optional payload to include with the message.
	 */
	message(channelName: string, messageName: string, payload?: unknown): void;

}

export default Receivable;
