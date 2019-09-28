import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ResizeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "resize";
	}

}

export default ResizeEventDecorator;
