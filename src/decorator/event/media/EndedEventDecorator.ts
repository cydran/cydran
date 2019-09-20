import {AbstractEventDecorator} from "../AbstractEventDecorator";

class EndedEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("ended");
		this.listenTo("dom", "ended", this.handleEvent);
	}

}

export default EndedEventDecorator;
