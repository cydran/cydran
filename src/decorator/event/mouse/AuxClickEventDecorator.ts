import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class AuxClickEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "auxclick";
	}

}

export default AuxClickEventDecorator;
