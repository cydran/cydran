import {AbstractEventDecorator} from "../AbstractEventDecorator";

class MessageEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("message");
		this.listenTo("dom", "message", this.handleEvent);
	}

}

export default MessageEventDecorator;
