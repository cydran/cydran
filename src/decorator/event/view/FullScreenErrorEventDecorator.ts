import AbstractEventDecorator from "../AbstractEventDecorator";

class FullScreenErrorEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "fullscreenerror";
	}

}

export default FullScreenErrorEventDecorator;
