import {AbstractEventDecorator} from "../AbstractEventDecorator";

class PopStateEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("popstate");
		this.listenTo("dom", "popstate", this.handleEvent);
	}

}

export default PopStateEventDecorator;
