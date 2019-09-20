import {AbstractEventDecorator} from "../AbstractEventDecorator";

class OpenEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("open");
		this.listenTo("dom", "open", this.handleEvent);
	}

}

export default OpenEventDecorator;
