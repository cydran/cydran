import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class SeekingEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "seeking";
	}

}

export default SeekingEventDecorator;
