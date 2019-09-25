import {AbstractEventDecorator} from "../AbstractEventDecorator";

class CanPlayEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("canplay");
		this.listenTo("dom", "canplay", this.handleEvent);
	}

}

export default CanPlayEventDecorator;
