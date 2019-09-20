import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ReadyStateChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("readystatechange");
		this.listenTo("dom", "readystatechange", this.handleEvent);
	}

}

export default ReadyStateChangeEventDecorator;
