import {AbstractEventDecorator} from "../AbstractEventDecorator";

class UnloadEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("unload");
		this.listenTo("dom", "unload", this.handleEvent);
	}

}

export default UnloadEventDecorator;
