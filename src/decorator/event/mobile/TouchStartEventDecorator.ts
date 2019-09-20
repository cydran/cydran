import {AbstractEventDecorator} from "../AbstractEventDecorator";

class TouchStartEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("touchstart");
		this.listenTo("dom", "touchstart", this.handleEvent);
	}

}

export default TouchStartEventDecorator;
