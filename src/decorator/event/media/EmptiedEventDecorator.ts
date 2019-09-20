import {AbstractEventDecorator} from "../AbstractEventDecorator";

class EmptiedEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("emptied");
		this.listenTo("dom", "emptied", this.handleEvent);
	}

}

export default EmptiedEventDecorator;
