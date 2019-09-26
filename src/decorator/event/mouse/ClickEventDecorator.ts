import AbstractEventDecorator from "../AbstractEventDecorator";

class ClickEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "click";
	}

}

export default ClickEventDecorator;
