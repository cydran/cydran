import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class SeekingEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "seeking";
	}

}

export default SeekingEventDecorator;
