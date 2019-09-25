import {AbstractEventDecorator} from "../AbstractEventDecorator";

class PlayingEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("playing");
		this.listenTo("dom", "playing", this.handleEvent);
	}

}

export default PlayingEventDecorator;
