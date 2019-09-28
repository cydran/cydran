import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class FullScreenChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "fullscreenchange";
	}

}

export default FullScreenChangeEventDecorator;
