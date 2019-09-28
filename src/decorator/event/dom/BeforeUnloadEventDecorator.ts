import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class BeforeUnloadEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "beforeunload";
	}

}

export default BeforeUnloadEventDecorator;
