import {AbstractEventDecorator} from "../AbstractEventDecorator";

class MouseMoveEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("mousemove");
		this.listenTo("dom", "mousemove", this.handleEvent);
	}

}

export default MouseMoveEventDecorator;
