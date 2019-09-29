import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class ScrollEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "scroll";
	}

}

export default ScrollEventDecorator;
