import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class FullScreenErrorEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "fullscreenerror";
	}

}

export default FullScreenErrorEventDecorator;
