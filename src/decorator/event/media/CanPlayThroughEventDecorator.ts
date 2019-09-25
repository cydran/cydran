import {AbstractEventDecorator} from "../AbstractEventDecorator";

class CanPlayThroughEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("canplaythrough");
		this.listenTo("dom", "canplaythrough", this.handleEvent);
	}

}

export default CanPlayThroughEventDecorator;
