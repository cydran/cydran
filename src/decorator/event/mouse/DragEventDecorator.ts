import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DragEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("drag");
		this.listenTo("dom", "drag", this.handleEvent);
	}

}

export default DragEventDecorator;
