import {AbstractEventDecorator} from "../AbstractEventDecorator";

class PageHideEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("pagehide");
		this.listenTo("dom", "pagehide", this.handleEvent);
	}

}

export default PageHideEventDecorator;
