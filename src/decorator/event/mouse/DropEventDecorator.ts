import AbstractEventDecorator from "../AbstractEventDecorator";

class DropEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "drop";
	}

}

export default DropEventDecorator;
