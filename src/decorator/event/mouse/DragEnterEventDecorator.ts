import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DragEnterEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("dragenter");
		this.listenTo("dom", "dragenter", this.handleEvent);
	}

}

export default DragEnterEventDecorator;
