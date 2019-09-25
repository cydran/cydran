import {AbstractEventDecorator} from "../AbstractEventDecorator";

class StalledEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("stalled");
		this.listenTo("dom", "stalled", this.handleEvent);
	}

}

export default StalledEventDecorator;
