import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DragLeaveEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("dragleave");
		this.listenTo("dom", "dragleave", this.handleEvent);
	}

}

export default DragLeaveEventDecorator;
