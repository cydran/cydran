import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ContextMenuEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("contextmenu");
		this.listenTo("dom", "contextmenu", this.handleEvent);
	}

}

export default ContextMenuEventDecorator;
