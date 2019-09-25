import {AbstractEventDecorator} from "../AbstractEventDecorator";

class MouseDownEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("mousedown");
		this.listenTo("dom", "mousedown", this.handleEvent);
	}

}

export default MouseDownEventDecorator;
