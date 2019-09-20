import {AbstractEventDecorator} from "../AbstractEventDecorator";

class RedoEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("redo");
		this.listenTo("dom", "redo", this.handleEvent);
	}

}

export default RedoEventDecorator;
