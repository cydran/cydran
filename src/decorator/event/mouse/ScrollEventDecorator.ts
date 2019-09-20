import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ScrollEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("scroll");
		this.listenTo("dom", "scroll", this.handleEvent);
	}

}

export default ScrollEventDecorator;
