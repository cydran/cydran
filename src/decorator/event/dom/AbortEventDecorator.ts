import {AbstractEventDecorator} from "../AbstractEventDecorator";

class AbortEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("abort");
		this.listenTo("dom", "abort", this.handleEvent);
	}

}

export default AbortEventDecorator;
