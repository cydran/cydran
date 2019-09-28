import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class EmptiedEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "emptied";
	}

}

export default EmptiedEventDecorator;
