import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class PopStateEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "popstate";
	}

}

export default PopStateEventDecorator;
