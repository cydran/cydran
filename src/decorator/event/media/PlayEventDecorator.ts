import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class PlayEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "play";
	}

}

export default PlayEventDecorator;
