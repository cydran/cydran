import {AbstractEventDecorator} from "../AbstractEventDecorator";

class DblClickEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("dblclick");
		this.listenTo("dom", "dblclick", this.handleEvent);
	}

}

export default DblClickEventDecorator;
