import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class PauseEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "pause";
	}

}

export default PauseEventDecorator;
