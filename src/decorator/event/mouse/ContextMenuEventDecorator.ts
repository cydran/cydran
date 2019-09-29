import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * 
 */
class ContextMenuEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "contextmenu";
	}

}

export default ContextMenuEventDecorator;
