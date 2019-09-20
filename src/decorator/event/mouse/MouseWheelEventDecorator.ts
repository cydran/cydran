import {AbstractEventDecorator} from "../AbstractEventDecorator";

class MouseWheelEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("mousewheel");
		this.listenTo("dom", "mousewheel", this.handleEvent);
	}

}

export default MouseWheelEventDecorator;
