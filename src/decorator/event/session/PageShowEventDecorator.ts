import {AbstractEventDecorator} from "../AbstractEventDecorator";

class PageShowEventDecorator extends AbstractEventDecorator<Function> {

	public wire(): void {
		this.consume("pageshow");
		this.listenTo("dom", "pageshow", this.handleEvent);
	}

}

export default PageShowEventDecorator;
