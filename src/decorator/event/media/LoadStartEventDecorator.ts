import {AbstractEventDecorator} from "../AbstractEventDecorator";

class LoadStartEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("loadstart");
		this.listenTo("dom", "loadstart", this.handleEvent);
	}

}

export default LoadStartEventDecorator;
