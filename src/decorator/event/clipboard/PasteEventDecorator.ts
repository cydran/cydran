import AbstractEventDecorator from "../AbstractEventDecorator";

class PasteEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "paste";
	}

}

export default PasteEventDecorator;
