import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ErrorEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("error");
		this.listenTo("dom", "error", this.handleEvent);
	}

}

export default ErrorEventDecorator;
