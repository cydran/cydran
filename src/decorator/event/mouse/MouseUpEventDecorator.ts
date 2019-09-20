import {AbstractEventDecorator} from "../AbstractEventDecorator";

class MouseUpEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("mouseup");
		this.listenTo("dom", "mouseup", this.handleEvent);
	}

}

export default MouseUpEventDecorator;
