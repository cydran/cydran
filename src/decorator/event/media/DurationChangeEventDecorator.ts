import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DurationChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("durationchange");
		this.listenTo("dom", "durationchange", this.handleEvent);
	}

}

export default DurationChangeEventDecorator;
