import {AbstractEventDecorator} from "../AbstractEventDecorator";

class RateChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("ratechange");
		this.listenTo("dom", "ratechange", this.handleEvent);
	}

}

export default RateChangeEventDecorator;
