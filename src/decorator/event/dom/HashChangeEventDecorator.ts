import AbstractEventDecorator from "../AbstractEventDecorator";

class HashChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "hashchange";
	}

}

export default HashChangeEventDecorator;
