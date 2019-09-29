import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class UnloadEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "unload";
	}

}

export default UnloadEventDecorator;
