import {AbstractEventDecorator} from "../AbstractEventDecorator";

class SeekedEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("seeked");
		this.listenTo("dom", "seeked", this.handleEvent);
	}

}

export default SeekedEventDecorator;
