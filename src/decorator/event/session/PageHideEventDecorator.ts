import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class PageHideEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "pagehide";
	}

}

export default PageHideEventDecorator;
