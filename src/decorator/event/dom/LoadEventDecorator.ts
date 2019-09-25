import {AbstractEventDecorator} from "../AbstractEventDecorator";

class LoadEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("load");
		this.listenTo("dom", "load", this.handleEvent);
	}

}

export default LoadEventDecorator;
