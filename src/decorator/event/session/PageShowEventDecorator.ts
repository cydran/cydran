import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class PageShowEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "pageshow";
	}

}

export default PageShowEventDecorator;
