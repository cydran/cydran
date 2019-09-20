import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ToggleEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("toggle");
		this.listenTo("dom", "toggle", this.handleEvent);
	}

}

export default ToggleEventDecorator;
