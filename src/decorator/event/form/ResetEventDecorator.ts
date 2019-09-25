import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ResetEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("reset");
		this.listenTo("dom", "reset", this.handleEvent);
	}

}

export default ResetEventDecorator;
