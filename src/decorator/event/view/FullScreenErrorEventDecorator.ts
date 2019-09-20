import {AbstractEventDecorator} from "../AbstractEventDecorator";

class FullScreenErrorEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("fullscreenerror");
		this.listenTo("dom", "fullscreenerror", this.handleEvent);
	}

}

export default FullScreenErrorEventDecorator;
