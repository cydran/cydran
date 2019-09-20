import {AbstractEventDecorator} from "../AbstractEventDecorator";

class PlayEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("play");
		this.listenTo("dom", "play", this.handleEvent);
	}

}

export default PlayEventDecorator;
