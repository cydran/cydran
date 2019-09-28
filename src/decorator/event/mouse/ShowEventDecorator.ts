import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ShowEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "show";
	}

}

export default ShowEventDecorator;
