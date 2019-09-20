import {AbstractEventDecorator} from "../AbstractEventDecorator";

class FocusInEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("focusin");
		this.listenTo("dom", "focusin", this.handleEvent);
	}

}

export default FocusInEventDecorator;
