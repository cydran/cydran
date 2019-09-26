import AbstractEventDecorator from "../AbstractEventDecorator";

class PlayingEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "playing";
	}

}

export default PlayingEventDecorator;
