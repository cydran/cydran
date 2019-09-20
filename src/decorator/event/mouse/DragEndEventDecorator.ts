import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DragEndEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("dragend");
		this.listenTo("dom", "dragend", this.handleEvent);
	}

}

export default DragEndEventDecorator;
