import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class LoadEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "load";
	}

}

export default LoadEventDecorator;
