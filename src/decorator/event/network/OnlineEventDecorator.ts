import {AbstractEventDecorator} from "../AbstractEventDecorator";

class OnlineEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("online");
		this.listenTo("dom", "online", this.handleEvent);
	}

}

export default OnlineEventDecorator;
