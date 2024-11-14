import { To } from "CydranConstants";

/**
 * Represents an object that can send messages to other objects.
 */
interface Sendable {

	/**
	 * Sends a message with a specific propagation.
	 * @param propagation Propagation of the message
	 * @param channelName The name of the channel to send the message to
	 * @param messageName The name of the message to send
	 * @param payload The optional payload to include with the message
	 */
	send(propagation: To, channelName: string, messageName: string, payload?: any): void;

}

export default Sendable;
