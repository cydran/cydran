import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class LoadStartEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "loadstart";
	}

}

export default LoadStartEventDecorator;
