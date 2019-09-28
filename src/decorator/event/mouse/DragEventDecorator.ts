import AbstractEventDecorator from "../AbstractEventDecorator";

class DragEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "drag";
	}

}

export default DragEventDecorator;
