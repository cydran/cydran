import AbstractEventDecorator from "../AbstractEventDecorator";

class ShowEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "show";
	}

}

export default ShowEventDecorator;
