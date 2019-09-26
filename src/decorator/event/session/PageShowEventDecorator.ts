import AbstractEventDecorator from "../AbstractEventDecorator";

class PageShowEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "pageshow";
	}

}

export default PageShowEventDecorator;
