import {AbstractEventDecorator} from "../AbstractEventDecorator";

class FocusOutEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("focusout");
		this.listenTo("dom", "focusout", this.handleEvent);
	}

}

export default FocusOutEventDecorator;
