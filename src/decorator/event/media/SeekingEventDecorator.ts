import {AbstractEventDecorator} from "../AbstractEventDecorator";

class SeekingEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("seeking");
		this.listenTo("dom", "seeking", this.handleEvent);
	}

}

export default SeekingEventDecorator;
