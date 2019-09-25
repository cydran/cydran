import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ProgressEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("progress");
		this.listenTo("dom", "progress", this.handleEvent);
	}

}

export default ProgressEventDecorator;
