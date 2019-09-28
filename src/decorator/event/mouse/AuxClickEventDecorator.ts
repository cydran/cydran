import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class AuxClickEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "auxclick";
	}

}

export default AuxClickEventDecorator;
