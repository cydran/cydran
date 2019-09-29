import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class EmptiedEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "emptied";
	}

}

export default EmptiedEventDecorator;
