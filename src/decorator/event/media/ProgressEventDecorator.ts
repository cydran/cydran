import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ProgressEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "progress";
	}

}

export default ProgressEventDecorator;
