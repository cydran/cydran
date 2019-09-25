import {AbstractEventDecorator} from "../AbstractEventDecorator";

class PauseEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("pause");
		this.listenTo("dom", "pause", this.handleEvent);
	}

}

export default PauseEventDecorator;
