import AbstractEventDecorator from "../AbstractEventDecorator";

class RateChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "ratechange";
	}

}

export default RateChangeEventDecorator;
