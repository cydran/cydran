import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class ContextMenu extends AbstractEvent {

	protected getEventKey(): string {
		return "contextmenu";
	}

}

export default ContextMenu;
