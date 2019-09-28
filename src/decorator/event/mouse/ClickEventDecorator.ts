import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ClickEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "click";
	}

}

export default ClickEventDecorator;
