import {AbstractEventDecorator} from "../AbstractEventDecorator";

class ClickEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("click");
		this.listenTo("dom", "click", this.handleEvent);
	}

}

export default ClickEventDecorator;
