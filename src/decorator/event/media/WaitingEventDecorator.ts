import {AbstractEventDecorator} from "../AbstractEventDecorator";

class WaitingEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("waiting");
		this.listenTo("dom", "waiting", this.handleEvent);
	}

}

export default WaitingEventDecorator;
