import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class LoadEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "load";
	}

}

export default LoadEventDecorator;
