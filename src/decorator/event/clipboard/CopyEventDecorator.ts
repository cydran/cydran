import {AbstractEventDecorator} from "../AbstractEventDecorator";

class CopyEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("copy");
		this.listenTo("dom", "copy", this.handleEvent);
	}

}

export default CopyEventDecorator;
