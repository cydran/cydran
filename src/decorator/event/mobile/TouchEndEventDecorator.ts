import {AbstractEventDecorator} from "../AbstractEventDecorator";

class TouchEndEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("touchend");
		this.listenTo("dom", "touchend", this.handleEvent);
	}

}

export default TouchEndEventDecorator;
