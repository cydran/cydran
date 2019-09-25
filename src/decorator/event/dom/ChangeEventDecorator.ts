import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("change");
		this.listenTo("dom", "change", this.handleEvent);
	}

}

export default ChangeEventDecorator;
