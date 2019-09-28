import AbstractEventDecorator from "../AbstractEventDecorator";

class ResizeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "resize";
	}

}

export default ResizeEventDecorator;
