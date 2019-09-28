import AbstractEventDecorator from "../AbstractEventDecorator";

class PopStateEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "popstate";
	}

}

export default PopStateEventDecorator;
