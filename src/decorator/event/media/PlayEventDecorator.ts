import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class PlayEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "play";
	}

}

export default PlayEventDecorator;
