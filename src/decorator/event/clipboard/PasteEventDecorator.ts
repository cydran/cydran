import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class PasteEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "paste";
	}

}

export default PasteEventDecorator;
