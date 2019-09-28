import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ScrollEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "scroll";
	}

}

export default ScrollEventDecorator;
