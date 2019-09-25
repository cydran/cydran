import {AbstractEventDecorator} from "../AbstractEventDecorator";

class BlurEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("blur");
		this.listenTo("dom", "blur", this.handleEvent);
	}

}

export default BlurEventDecorator;
