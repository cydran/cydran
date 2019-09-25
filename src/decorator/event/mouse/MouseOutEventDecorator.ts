import {AbstractEventDecorator} from "../AbstractEventDecorator";

class MouseOutEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("mouseout");
		this.listenTo("dom", "mouseout", this.handleEvent);
	}

}

export default MouseOutEventDecorator;
