import {AbstractEventDecorator} from "../AbstractEventDecorator";

class MouseOverEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("mouseover");
		this.listenTo("dom", "mouseover", this.handleEvent);
	}

}

export default MouseOverEventDecorator;
