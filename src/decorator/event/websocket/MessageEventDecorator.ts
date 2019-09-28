import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class MessageEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "message";
	}

}

export default MessageEventDecorator;
