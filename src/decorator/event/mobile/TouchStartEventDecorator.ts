import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class TouchStartEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "touchstart";
	}

}

export default TouchStartEventDecorator;
