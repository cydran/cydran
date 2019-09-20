import {AbstractEventDecorator} from "../AbstractEventDecorator";

class WindowErrorEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("error");
		this.listenTo("dom", "error", this.handleEvent);
	}

}

export default WindowErrorEventDecorator;
