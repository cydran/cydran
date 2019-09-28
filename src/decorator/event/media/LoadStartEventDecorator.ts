import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class LoadStartEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "loadstart";
	}

}

export default LoadStartEventDecorator;
