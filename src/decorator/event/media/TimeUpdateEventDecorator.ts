import {AbstractEventDecorator} from "../AbstractEventDecorator";

class TimeUpdateEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("timeupdate");
		this.listenTo("dom", "timeupdate", this.handleEvent);
	}

}

export default TimeUpdateEventDecorator;
