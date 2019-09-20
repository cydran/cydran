import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DragOverEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("dragover");
		this.listenTo("dom", "dragover", this.handleEvent);
	}

}

export default DragOverEventDecorator;
