import {AbstractEventDecorator} from "../AbstractEventDecorator";

class PasteEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("paste");
		this.listenTo("dom", "paste", this.handleEvent);
	}

}

export default PasteEventDecorator;
