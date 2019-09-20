import {AbstractEventDecorator} from "../AbstractEventDecorator";

class WheelEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("wheel");
		this.listenTo("dom", "wheel", this.handleEvent);
	}

}

export default WheelEventDecorator;
