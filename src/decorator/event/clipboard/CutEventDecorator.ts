import {AbstractEventDecorator} from "../AbstractEventDecorator";

class CutEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("cut");
		this.listenTo("dom", "cut", this.handleEvent);
	}

}

export default CutEventDecorator;
