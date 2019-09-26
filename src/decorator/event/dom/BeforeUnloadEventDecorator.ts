import AbstractEventDecorator from "../AbstractEventDecorator";

class BeforeUnloadEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "beforeunload";
	}

}

export default BeforeUnloadEventDecorator;
