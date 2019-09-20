import {AbstractEventDecorator} from "../AbstractEventDecorator";

class FullScreenChangeEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("fullscreenchange");
		this.listenTo("dom", "fullscreenchange", this.handleEvent);
	}

}

export default FullScreenChangeEventDecorator;
