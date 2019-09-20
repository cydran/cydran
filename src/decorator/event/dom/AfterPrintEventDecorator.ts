import {AbstractEventDecorator} from "../AbstractEventDecorator";

class AfterPrintEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("afterprint");
		this.listenTo("dom", "afterprint", this.handleEvent);
	}

}

export default AfterPrintEventDecorator;
