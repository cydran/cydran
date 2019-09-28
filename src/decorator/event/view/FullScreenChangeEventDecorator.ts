import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class FullScreenChangeEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "fullscreenchange";
	}

}

export default FullScreenChangeEventDecorator;
