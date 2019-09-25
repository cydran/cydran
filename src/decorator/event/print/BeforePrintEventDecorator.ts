import {AbstractEventDecorator} from "../AbstractEventDecorator";

class BeforePrintEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("beforeprint");
		this.listenTo("dom", "beforeprint", this.handleEvent);
	}

}

export default BeforePrintEventDecorator;
