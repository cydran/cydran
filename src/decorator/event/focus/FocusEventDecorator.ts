import {AbstractEventDecorator} from "../AbstractEventDecorator";

class FocusEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("focus");
		this.listenTo("dom", "focus", this.handleEvent);
	}

}

export default FocusEventDecorator;
