import {AbstractEventDecorator} from "../AbstractEventDecorator";

class AuxClickEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("auxclick");
		this.listenTo("dom", "auxclick", this.handleEvent);
	}

}

export default AuxClickEventDecorator;
