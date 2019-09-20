import {AbstractEventDecorator} from "../AbstractEventDecorator";

class TouchCancelEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("touchcancel");
		this.listenTo("dom", "touchcancel", this.handleEvent);
	}

}

export default TouchCancelEventDecorator;
