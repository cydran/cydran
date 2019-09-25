import {AbstractEventDecorator} from "../AbstractEventDecorator";

class UndoEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("undo");
		this.listenTo("dom", "undo", this.handleEvent);
	}

}

export default UndoEventDecorator;
