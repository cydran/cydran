import {AbstractEventDecorator} from "../AbstractEventDecorator";

class TouchMoveEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("touchmove");
		this.listenTo("dom", "touchmove", this.handleEvent);
	}

}

export default TouchMoveEventDecorator;
