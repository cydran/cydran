import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DropEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("drop");
		this.listenTo("dom", "drop", this.handleEvent);
	}

}

export default DropEventDecorator;
