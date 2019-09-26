import AbstractEventDecorator from "../AbstractEventDecorator";

class ProgressEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "progress";
	}

}

export default ProgressEventDecorator;
