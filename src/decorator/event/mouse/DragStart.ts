import AbstractEvent from "../AbstractEvent";

/**
 * 
 */
class DragStart extends AbstractEvent {

	protected getEventKey(): string {
		return "dragstart";
	}

}

export default DragStart;
