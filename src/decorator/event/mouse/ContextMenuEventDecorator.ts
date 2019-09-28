import AbstractEventDecorator from "../AbstractEventDecorator";

/**
 * @external
 */
class ContextMenuEventDecorator extends AbstractEventDecorator {

	protected getEventKey(): string {
		return "contextmenu";
	}

}

export default ContextMenuEventDecorator;
