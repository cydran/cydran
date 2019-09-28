import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class UnloadEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "unload";
	}

}

export default UnloadEventDecorator;
