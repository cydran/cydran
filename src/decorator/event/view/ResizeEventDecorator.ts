import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ResizeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("resize");
		this.listenTo("dom", "resize", this.handleEvent);
	}

}

export default ResizeEventDecorator;
