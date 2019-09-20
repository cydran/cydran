import {AbstractEventDecorator} from "../AbstractEventDecorator";

class SelectEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("select");
		this.listenTo("dom", "select", this.handleEvent);
	}

}

export default SelectEventDecorator;
