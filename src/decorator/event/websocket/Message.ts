import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class Message extends AbstractEvent {

	protected getEventKey(): string {
		return "message";
	}

}

export default Message;
