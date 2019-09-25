import {AbstractEventDecorator} from "../AbstractEventDecorator";

class CloseEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("close");
		this.listenTo("dom", "close", this.handleEvent);
	}

}

export default CloseEventDecorator;
