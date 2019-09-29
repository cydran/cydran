import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class MessageEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "message";
	}

}

export default MessageEventDecorator;
