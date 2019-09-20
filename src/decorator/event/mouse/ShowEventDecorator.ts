import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ShowEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("show");
		this.listenTo("dom", "show", this.handleEvent);
	}

}

export default ShowEventDecorator;
