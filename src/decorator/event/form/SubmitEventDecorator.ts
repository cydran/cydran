import {AbstractEventDecorator} from "../AbstractEventDecorator";

class SubmitEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("submit");
		this.listenTo("dom", "submit", this.handleEvent);
	}

}

export default SubmitEventDecorator;
