import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class PlayingEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "playing";
	}

}

export default PlayingEventDecorator;
