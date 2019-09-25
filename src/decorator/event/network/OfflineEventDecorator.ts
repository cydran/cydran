import {AbstractEventDecorator} from "../AbstractEventDecorator";

class OfflineEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("offline");
		this.listenTo("dom", "offline", this.handleEvent);
	}

}

export default OfflineEventDecorator;
