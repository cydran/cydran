import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DragStartEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("dragstart");
		this.listenTo("dom", "dragstart", this.handleEvent);
	}

}

export default DragStartEventDecorator;
