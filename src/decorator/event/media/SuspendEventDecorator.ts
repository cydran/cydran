import {AbstractEventDecorator} from "../AbstractEventDecorator";

class SuspendEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("suspend");
		this.listenTo("dom", "suspend", this.handleEvent);
	}

}

export default SuspendEventDecorator;
