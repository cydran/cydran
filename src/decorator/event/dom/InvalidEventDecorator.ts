import {AbstractEventDecorator} from "../AbstractEventDecorator";

class InvalidEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("invalid");
		this.listenTo("dom", "invalid", this.handleEvent);
	}

}

export default InvalidEventDecorator;
