import {AbstractEventDecorator} from "../AbstractEventDecorator";

class BeforeUnloadEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("beforeunload");
		this.listenTo("dom", "beforeunload", this.handleEvent);
	}

}

export default BeforeUnloadEventDecorator;
