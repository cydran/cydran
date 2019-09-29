import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class PageHideEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "pagehide";
	}

}

export default PageHideEventDecorator;
